"""
Synapse CV Analysis Function
Appwrite Function for Cyclic Voltammetry analysis using MADAP
"""

import json
import os
import numpy as np
from io import StringIO


def main(context):
    """
    Appwrite Function entry point for CV analysis.
    
    Expected payload:
    {
        "file_data": "CSV or text content of CV data",
        "scan_rate": 50,  # mV/s
        "electrode_area": 0.196,  # cm²
        "peak_detection": true,
        "calculate_diffusion": true
    }
    """
    try:
        # Parse request
        payload = context.req.body
        
        if isinstance(payload, str):
            payload = json.loads(payload)
        
        file_data = payload.get('file_data', '')
        scan_rate = float(payload.get('scan_rate', 50))
        electrode_area = float(payload.get('electrode_area', 0.196))
        peak_detection = payload.get('peak_detection', True)
        calculate_diffusion = payload.get('calculate_diffusion', True)
        
        # Parse CV data
        potential, current = parse_cv_data(file_data)
        
        # Perform analysis
        results = analyze_cv(
            potential=potential,
            current=current,
            scan_rate=scan_rate,
            electrode_area=electrode_area,
            peak_detection=peak_detection,
            calculate_diffusion=calculate_diffusion
        )
        
        return context.res.json({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return context.res.json({
            'success': False,
            'error': str(e)
        }, 500)


def parse_cv_data(file_data: str):
    """Parse CV data from CSV/text format."""
    lines = file_data.strip().split('\n')
    
    potential = []
    current = []
    
    for line in lines:
        # Skip headers and comments
        if line.startswith('#') or not line.strip():
            continue
        
        try:
            parts = line.split(',')
            if len(parts) >= 2:
                potential.append(float(parts[0]))
                current.append(float(parts[1]))
        except ValueError:
            continue
    
    return np.array(potential), np.array(current)


def analyze_cv(
    potential: np.ndarray,
    current: np.ndarray,
    scan_rate: float,
    electrode_area: float,
    peak_detection: bool,
    calculate_diffusion: bool
) -> dict:
    """
    Analyze cyclic voltammetry data.
    
    Returns peak positions, currents, and derived parameters.
    """
    results = {
        'data_points': len(potential),
        'potential_range': {
            'min': float(np.min(potential)),
            'max': float(np.max(potential))
        },
        'scan_rate': scan_rate,
        'electrode_area': electrode_area
    }
    
    if peak_detection:
        # Find peaks in CV
        peaks = detect_cv_peaks(potential, current)
        results['peaks'] = peaks
        
        # Calculate peak separation
        if peaks.get('anodic') and peaks.get('cathodic'):
            delta_ep = abs(peaks['anodic']['potential'] - peaks['cathodic']['potential'])
            results['peak_separation_mV'] = delta_ep * 1000
            
            # Half-wave potential
            e_half = (peaks['anodic']['potential'] + peaks['cathodic']['potential']) / 2
            results['half_wave_potential'] = e_half
            
            # Current ratio
            if peaks['cathodic']['current'] != 0:
                ratio = abs(peaks['anodic']['current'] / peaks['cathodic']['current'])
                results['current_ratio'] = ratio
                
                # Reversibility assessment
                if ratio > 0.9 and ratio < 1.1 and delta_ep * 1000 < 70:
                    results['reversibility'] = 'Reversible'
                elif ratio > 0.7 and delta_ep * 1000 < 200:
                    results['reversibility'] = 'Quasi-reversible'
                else:
                    results['reversibility'] = 'Irreversible'
    
    if calculate_diffusion and 'peaks' in results:
        # Randles-Sevcik equation for reversible system
        # ip = 2.69 × 10^5 × n^(3/2) × A × D^(1/2) × C × v^(1/2)
        # Assuming n=1, C=1mM, solve for D
        
        ip = abs(results['peaks']['anodic']['current'])
        # v in V/s
        v = scan_rate / 1000
        
        # Estimate diffusion coefficient (assuming n=1, C=1mM)
        # D = (ip / (2.69e5 * n^1.5 * A * C * v^0.5))^2
        n = 1
        C = 1e-6  # 1 mM in mol/cm³
        
        D_calc = (ip / (2.69e5 * (n**1.5) * electrode_area * C * (v**0.5)))**2
        results['diffusion_coefficient'] = D_calc
        results['diffusion_coefficient_formatted'] = f"{D_calc:.2e} cm²/s"
    
    return results


def detect_cv_peaks(potential: np.ndarray, current: np.ndarray) -> dict:
    """
    Detect anodic and cathodic peaks in CV data.
    """
    # Find forward and reverse scans
    mid_idx = len(potential) // 2
    
    # Forward scan (first half) - anodic
    forward_pot = potential[:mid_idx]
    forward_curr = current[:mid_idx]
    
    # Reverse scan (second half) - cathodic  
    reverse_pot = potential[mid_idx:]
    reverse_curr = current[mid_idx:]
    
    peaks = {}
    
    # Anodic peak (maximum in forward scan)
    anodic_idx = np.argmax(forward_curr)
    peaks['anodic'] = {
        'potential': float(forward_pot[anodic_idx]),
        'current': float(forward_curr[anodic_idx]),
        'current_mA': float(forward_curr[anodic_idx] * 1000)
    }
    
    # Cathodic peak (minimum in reverse scan)
    cathodic_idx = np.argmin(reverse_curr)
    peaks['cathodic'] = {
        'potential': float(reverse_pot[cathodic_idx]),
        'current': float(reverse_curr[cathodic_idx]),
        'current_mA': float(reverse_curr[cathodic_idx] * 1000)
    }
    
    return peaks


# For local testing
if __name__ == '__main__':
    # Test with sample data
    test_data = """
# Potential (V), Current (A)
-0.5, -0.0001
-0.3, -0.00005
-0.1, 0.0001
0.1, 0.0005
0.3, 0.002
0.5, 0.00234
0.7, 0.001
0.5, -0.001
0.3, -0.00221
0.1, -0.0005
-0.1, -0.0001
-0.3, -0.00002
-0.5, -0.0001
"""
    
    potential, current = parse_cv_data(test_data)
    results = analyze_cv(
        potential=potential,
        current=current,
        scan_rate=50,
        electrode_area=0.196,
        peak_detection=True,
        calculate_diffusion=True
    )
    
    print(json.dumps(results, indent=2))
