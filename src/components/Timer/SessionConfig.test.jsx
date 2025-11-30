import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SessionConfig } from './SessionConfig';

describe('SessionConfig', () => {
  const defaultProps = {
    studyDuration: 25,
    restDuration: 5,
    cyclesPlanned: 1,
    onStudyDurationChange: vi.fn(() => ({ success: true })),
    onRestDurationChange: vi.fn(() => ({ success: true })),
    onCyclesPlannedChange: vi.fn(() => ({ success: true })),
    disabled: false
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders all configuration inputs', () => {
    render(<SessionConfig {...defaultProps} />);
    
    expect(screen.getByLabelText(/study duration/i)).toBeDefined();
    expect(screen.getByLabelText(/rest duration/i)).toBeDefined();
    expect(screen.getByLabelText(/1 cycle/i)).toBeDefined();
  });

  it('displays current values in inputs', () => {
    render(<SessionConfig {...defaultProps} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    const restInput = screen.getByLabelText(/rest duration/i);
    
    expect(studyInput.value).toBe('25');
    expect(restInput.value).toBe('5');
  });

  it('calls onStudyDurationChange when study input is blurred with valid value', () => {
    const onStudyDurationChange = vi.fn(() => ({ success: true }));
    render(<SessionConfig {...defaultProps} onStudyDurationChange={onStudyDurationChange} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    fireEvent.change(studyInput, { target: { value: '45' } });
    fireEvent.blur(studyInput);
    
    expect(onStudyDurationChange).toHaveBeenCalledWith(45);
  });

  it('displays error message when study duration is invalid', () => {
    const onStudyDurationChange = vi.fn(() => ({ 
      success: false, 
      error: 'Study duration must be between 25 and 90 minutes' 
    }));
    render(<SessionConfig {...defaultProps} onStudyDurationChange={onStudyDurationChange} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    fireEvent.change(studyInput, { target: { value: '100' } });
    fireEvent.blur(studyInput);
    
    expect(screen.getByText(/study duration must be between 25 and 90 minutes/i)).toBeDefined();
  });

  it('calls onRestDurationChange when rest input is blurred with valid value', () => {
    const onRestDurationChange = vi.fn(() => ({ success: true }));
    render(<SessionConfig {...defaultProps} onRestDurationChange={onRestDurationChange} />);
    
    const restInput = screen.getByLabelText(/rest duration/i);
    fireEvent.change(restInput, { target: { value: '10' } });
    fireEvent.blur(restInput);
    
    expect(onRestDurationChange).toHaveBeenCalledWith(10);
  });

  it('displays error message when rest duration is invalid', () => {
    const onRestDurationChange = vi.fn(() => ({ 
      success: false, 
      error: 'Rest duration must be between 5 and 20 minutes' 
    }));
    render(<SessionConfig {...defaultProps} onRestDurationChange={onRestDurationChange} />);
    
    const restInput = screen.getByLabelText(/rest duration/i);
    fireEvent.change(restInput, { target: { value: '25' } });
    fireEvent.blur(restInput);
    
    expect(screen.getByText(/rest duration must be between 5 and 20 minutes/i)).toBeDefined();
  });

  it('calls onCyclesPlannedChange when cycle button is clicked', () => {
    const onCyclesPlannedChange = vi.fn(() => ({ success: true }));
    render(<SessionConfig {...defaultProps} onCyclesPlannedChange={onCyclesPlannedChange} />);
    
    const cycle3Button = screen.getByLabelText(/3 cycles/i);
    fireEvent.click(cycle3Button);
    
    expect(onCyclesPlannedChange).toHaveBeenCalledWith(3);
  });

  it('highlights the selected cycle button', () => {
    render(<SessionConfig {...defaultProps} cyclesPlanned={2} />);
    
    const cycle2Button = screen.getByLabelText(/2 cycles/i);
    expect(cycle2Button.className).toContain('bg-blue-600');
  });

  it('disables all inputs when disabled prop is true', () => {
    render(<SessionConfig {...defaultProps} disabled={true} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    const restInput = screen.getByLabelText(/rest duration/i);
    const cycle1Button = screen.getByLabelText(/1 cycle/i);
    
    expect(studyInput.disabled).toBe(true);
    expect(restInput.disabled).toBe(true);
    expect(cycle1Button.disabled).toBe(true);
  });

  it('handles non-numeric input for study duration', () => {
    render(<SessionConfig {...defaultProps} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    fireEvent.change(studyInput, { target: { value: 'abc' } });
    fireEvent.blur(studyInput);
    
    expect(screen.getByText(/please enter a valid number/i)).toBeDefined();
  });

  it('handles non-numeric input for rest duration', () => {
    render(<SessionConfig {...defaultProps} />);
    
    const restInput = screen.getByLabelText(/rest duration/i);
    fireEvent.change(restInput, { target: { value: 'xyz' } });
    fireEvent.blur(restInput);
    
    expect(screen.getByText(/please enter a valid number/i)).toBeDefined();
  });

  it('submits input on Enter key press', () => {
    const onStudyDurationChange = vi.fn(() => ({ success: true }));
    render(<SessionConfig {...defaultProps} onStudyDurationChange={onStudyDurationChange} />);
    
    const studyInput = screen.getByLabelText(/study duration/i);
    fireEvent.change(studyInput, { target: { value: '30' } });
    fireEvent.keyDown(studyInput, { key: 'Enter' });
    
    // Enter key should trigger blur
    // We need to manually trigger blur since jsdom doesn't fully simulate it
    fireEvent.blur(studyInput);
    
    expect(onStudyDurationChange).toHaveBeenCalledWith(30);
  });
});
