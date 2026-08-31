import React from 'react'
import sfx from '../../games/shared/sfx'
import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  /** Set false for buttons that fire their own sound (games handle their own). */
  clickSound?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  icon,
  fullWidth = false,
  disabled,
  className = '',
  clickSound = true,
  onClick,
  ...props
}) => {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const sizeClass = `btn-${size}`
  const widthClass = fullWidth ? 'btn-full' : ''
  const loadingClass = isLoading ? 'btn-loading' : ''
  const disabledClass = disabled ? 'btn-disabled' : ''

  // A small click makes every button feel like a real thing being pressed.
  // It rides the same mute switch as the rest of the app's audio.
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (clickSound) sfx.tap()
    onClick?.(event)
  }

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button
