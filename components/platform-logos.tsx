"use client"

import type React from "react"

interface LogoProps {
  className?: string
}

export const RaydiumLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      fill="#17BAFF"
    />
    <path
      d="M17.3892 6.0001H14.2783L10.1674 13.4348H6.61084V16.5457H10.1674L14.2783 9.11097H17.3892V6.0001Z"
      fill="white"
    />
    <path d="M17.3892 16.5457V13.4348H13.8327V16.5457H17.3892Z" fill="white" />
  </svg>
)

export const PumpFunLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="#FF4500" />
    <path
      d="M6 12.5V7H8.5V9.5H11V7H13.5V9.5H16V7H18.5V12.5C18.5 15.5376 16.0376 18 13 18C9.96243 18 7.5 15.5376 7.5 12.5H6Z"
      fill="white"
    />
    <path
      d="M13 15.5C14.3807 15.5 15.5 14.3807 15.5 13C15.5 11.6193 14.3807 10.5 13 10.5C11.6193 10.5 10.5 11.6193 10.5 13C10.5 14.3807 11.6193 15.5 13 15.5Z"
      fill="#FF4500"
      stroke="white"
    />
  </svg>
)

export const MoonShotLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#6B46C1" />
    <path
      d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z"
      fill="white"
    />
    <path d="M16 8L19 5M8 16L5 19M16 16L19 19M8 8L5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const JustLaunchLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F59E0B" />
    <path
      d="M12 5L12.8858 10.1142L18 11L12.8858 11.8858L12 17L11.1142 11.8858L6 11L11.1142 10.1142L12 5Z"
      fill="white"
    />
    <path
      d="M8 18L8.44289 15.5571L6 15L8.44289 14.4429L9 12L9.55711 14.4429L12 15L9.55711 15.5571L9 18L8.44289 15.5571Z"
      fill="white"
    />
  </svg>
)

export const LaunchLabLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#10B981" />
    <path d="M8 8H10V16H8V8Z" fill="white" />
    <path d="M12 8H14V16H12V8Z" fill="white" />
    <path d="M16 8H18V12H16V8Z" fill="white" />
    <path d="M6 6H18V7H6V6Z" fill="white" />
    <path d="M16 13H18V14H16V13Z" fill="white" />
  </svg>
)

export const PumpSwapLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#0EA5E9" />
    <path d="M7 10L12 5L17 10H14V14H10V10H7Z" fill="white" />
    <path d="M17 14L12 19L7 14H10V10H14V14H17Z" fill="white" fillOpacity="0.7" />
  </svg>
)

export const MeteoraLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#7C3AED" />
    <path
      d="M12 5L14.5981 10.5019L20.6085 11.2224L16.0415 15.3475L17.2671 21.2776L12 18.302L6.73286 21.2776L7.95845 15.3475L3.39155 11.2224L9.40192 10.5019L12 5Z"
      fill="white"
      fillOpacity="0.9"
    />
  </svg>
)

export const CookMemeLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#E11D48" />
    <path d="M16 8C16 8 16 6 14 6C12 6 12 8 12 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 8C12 8 12 6 10 6C8 6 8 8 8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 11C7 11 8 15 12 15C16 15 17 11 17 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 15V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 18H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const LetsBonkLogo: React.FC<LogoProps> = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FB923C" />
    <path d="M7 14L10 8L13 14L16 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 17H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="8" r="1.5" fill="white" />
    <circle cx="16" cy="14" r="1.5" fill="white" />
  </svg>
)
