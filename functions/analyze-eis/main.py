"""
Synapse EIS Analysis Function
Appwrite Function for Electrochemical Impedance Spectroscopy analysis
"""

import json
import numpy as np
from scipy.optimize import curve_fit


def main(context):
    """
    Appwrite Function entry point for EIS analysis.
    
    Expected payload:
    {
        "file_data": "CSV content with frequency, Z_real, Z_imag",
        "circuit": "randles",  # randles, randles-w, coating, custom
        "freq_min": 0.01,
        "freq_max": 100000
    }
    """
    try:
        payload = context.req.body
        
        if isinstance(payload, str):
            payload = json.loads(payload)
        
        file_data = payload.get('file_data', '')
        circuit = payload.get('circuit', 'randles')
        freq_min = float(payload.get('freq_min', 0.01))
        freq_max = float(payload.get('freq_max', 100000))
        
        # Parse EIS data
        frequency, z_real, z_imag = parse_eis_data(file_data)
        
        # Filter by frequency range
        mask = (frequency >= freq_min) & (frequency <= freq_max)
        frequency = frequency[mask]
        z_real = z_real[mask]
        z_imag = z_imag[mask]
        
        # Perform analysis
        results = analyze_eis(
            frequency=frequency,
            z_real=z_real,
            z_imag=z_imag,
            circuit=circuit
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


def parse_eis_data(file_data: str):
    """Parse EIS data from CSV/text format."""
    lines = file_data.strip().split('\n')
    
    frequency = []
    z_real = []
    z_imag = []
    
    for line in lines:
        if line.startswith('#') or not line.strip():
            continue
        
        try:
            parts = line.split(',')
            if len(parts) >= 3:
                frequency.append(float(parts[0]))
                z_real.append(float(parts[1]))
                z_imag.append(float(parts[2]))
        except ValueError:
            continue
    
    return np.array(frequency), np.array(z_real), np.array(z_imag)


def analyze_eis(
    frequency: np.ndarray,
    z_real: np.ndarray,
    z_imag: np.ndarray,
    circuit: str
) -> dict:
    """
    Analyze EIS data with equivalent circuit fitting.
    """
    # Calculate magnitude and phase
    z_mag = np.sqrt(z_real**2 + z_imag**2)
    z_phase = np.arctan2(-z_imag, z_real) * 180 / np.pi
    
    results = {
        'data_points': len(frequency),
        'frequency_range': {
            'min': float(np.min(frequency)),
            'max': float(np.max(frequency))
        },
        'impedance_range': {
            'z_real_min': float(np.min(z_real)),
            'z_real_max': float(np.max(z_real)),
            'z_imag_min': float(np.min(-z_imag)),
            'z_imag_max': float(np.max(-z_imag))
        },
        'circuit': circuit
    }
    
    # Fit equivalent circuit based on selection
    if circuit == 'randles':
        fitted_params, fit_quality = fit_randles(frequency, z_real, z_imag)
        results['fitted_parameters'] = fitted_params
        results['fit_quality'] = fit_quality
    elif circuit == 'randles-w':
        fitted_params, fit_quality = fit_randles_warburg(frequency, z_real, z_imag)
        results['fitted_parameters'] = fitted_params
        results['fit_quality'] = fit_quality
    
    # Generate plot data points for Nyquist and Bode
    results['nyquist_data'] = {
        'z_real': z_real.tolist(),
        'z_imag': (-z_imag).tolist()  # Convention: -Z'' on y-axis
    }
    
    results['bode_data'] = {
        'frequency': frequency.tolist(),
        'magnitude': z_mag.tolist(),
        'phase': z_phase.tolist()
    }
    
    return results


def fit_randles(
    frequency: np.ndarray,
    z_real: np.ndarray,
    z_imag: np.ndarray
) -> tuple:
    """
    Fit Randles circuit: R_s + (Q || R_ct)
    Returns fitted parameters and fit quality metric.
    """
    omega = 2 * np.pi * frequency
    
    def randles_impedance(omega, Rs, Rct, Q, n):
        """Calculate impedance for Randles circuit with CPE."""
        Zcpe = 1 / (Q * (1j * omega)**n)
        Zpar = 1 / (1/Rct + 1/Zcpe)
        return Rs + Zpar
    
    def objective(omega, Rs, Rct, Q, n):
        Z = randles_impedance(omega, Rs, Rct, Q, n)
        return np.concatenate([Z.real, Z.imag])
    
    z_measured = np.concatenate([z_real, z_imag])
    
    # Initial guesses
    Rs_init = np.min(z_real)
    Rct_init = np.max(z_real) - Rs_init
    Q_init = 1e-5
    n_init = 0.8
    
    try:
        popt, pcov = curve_fit(
            objective,
            omega,
            z_measured,
            p0=[Rs_init, Rct_init, Q_init, n_init],
            bounds=([0, 0, 1e-10, 0.5], [1e6, 1e6, 1e-2, 1.0]),
            maxfev=5000
        )
        
        Rs, Rct, Q, n = popt
        
        # Calculate fit quality (chi-squared)
        z_fit = randles_impedance(omega, Rs, Rct, Q, n)
        residuals = np.abs(z_fit - (z_real + 1j*z_imag))
        chi_squared = np.sum(residuals**2) / len(frequency)
        
        fitted_params = {
            'Rs': {'value': float(Rs), 'unit': 'Ω', 'error': float(np.sqrt(pcov[0,0]))},
            'Rct': {'value': float(Rct), 'unit': 'Ω', 'error': float(np.sqrt(pcov[1,1]))},
            'Q': {'value': float(Q), 'unit': 'F·s^(n-1)', 'error': float(np.sqrt(pcov[2,2]))},
            'n': {'value': float(n), 'unit': '', 'error': float(np.sqrt(pcov[3,3]))}
        }
        
        fit_quality = {
            'chi_squared': float(chi_squared),
            'quality': 'Excellent' if chi_squared < 1e-3 else 'Good' if chi_squared < 1e-2 else 'Fair'
        }
        
        return fitted_params, fit_quality
        
    except Exception as e:
        return {
            'error': str(e)
        }, {
            'chi_squared': None,
            'quality': 'Failed'
        }


def fit_randles_warburg(
    frequency: np.ndarray,
    z_real: np.ndarray,
    z_imag: np.ndarray
) -> tuple:
    """
    Fit Randles + Warburg circuit: R_s + (Q || (R_ct + W))
    """
    omega = 2 * np.pi * frequency
    
    def randles_warburg_impedance(omega, Rs, Rct, Q, n, Aw):
        """Calculate impedance for Randles + Warburg circuit."""
        # Warburg impedance
        Zw = Aw / np.sqrt(omega) * (1 - 1j)
        
        # CPE impedance
        Zcpe = 1 / (Q * (1j * omega)**n)
        
        # Parallel combination
        Zpar = 1 / (1/(Rct + Zw) + 1/Zcpe)
        
        return Rs + Zpar
    
    def objective(omega, Rs, Rct, Q, n, Aw):
        Z = randles_warburg_impedance(omega, Rs, Rct, Q, n, Aw)
        return np.concatenate([Z.real, Z.imag])
    
    z_measured = np.concatenate([z_real, z_imag])
    
    # Initial guesses
    Rs_init = np.min(z_real)
    Rct_init = (np.max(z_real) - Rs_init) / 2
    Q_init = 1e-5
    n_init = 0.8
    Aw_init = 100
    
    try:
        popt, pcov = curve_fit(
            objective,
            omega,
            z_measured,
            p0=[Rs_init, Rct_init, Q_init, n_init, Aw_init],
            bounds=([0, 0, 1e-10, 0.5, 0], [1e6, 1e6, 1e-2, 1.0, 1e6]),
            maxfev=5000
        )
        
        Rs, Rct, Q, n, Aw = popt
        
        # Calculate fit quality
        z_fit = randles_warburg_impedance(omega, Rs, Rct, Q, n, Aw)
        residuals = np.abs(z_fit - (z_real + 1j*z_imag))
        chi_squared = np.sum(residuals**2) / len(frequency)
        
        fitted_params = {
            'Rs': {'value': float(Rs), 'unit': 'Ω', 'error': float(np.sqrt(pcov[0,0]))},
            'Rct': {'value': float(Rct), 'unit': 'Ω', 'error': float(np.sqrt(pcov[1,1]))},
            'Q': {'value': float(Q), 'unit': 'F·s^(n-1)', 'error': float(np.sqrt(pcov[2,2]))},
            'n': {'value': float(n), 'unit': '', 'error': float(np.sqrt(pcov[3,3]))},
            'Aw': {'value': float(Aw), 'unit': 'Ω·s^-0.5', 'error': float(np.sqrt(pcov[4,4]))}
        }
        
        fit_quality = {
            'chi_squared': float(chi_squared),
            'quality': 'Excellent' if chi_squared < 1e-3 else 'Good' if chi_squared < 1e-2 else 'Fair'
        }
        
        return fitted_params, fit_quality
        
    except Exception as e:
        return {
            'error': str(e)
        }, {
            'chi_squared': None,
            'quality': 'Failed'
        }


# For local testing
if __name__ == '__main__':
    # Generate sample EIS data (Randles circuit)
    freq = np.logspace(-2, 5, 50)
    omega = 2 * np.pi * freq
    
    Rs = 10
    Rct = 200
    Q = 3e-5
    n = 0.85
    
    Zcpe = 1 / (Q * (1j * omega)**n)
    Zpar = 1 / (1/Rct + 1/Zcpe)
    Z = Rs + Zpar
    
    # Add some noise
    z_real = Z.real + np.random.normal(0, 0.5, len(freq))
    z_imag = Z.imag + np.random.normal(0, 0.5, len(freq))
    
    results = analyze_eis(
        frequency=freq,
        z_real=z_real,
        z_imag=z_imag,
        circuit='randles'
    )
    
    print(json.dumps({
        'fitted_parameters': results.get('fitted_parameters'),
        'fit_quality': results.get('fit_quality')
    }, indent=2))
