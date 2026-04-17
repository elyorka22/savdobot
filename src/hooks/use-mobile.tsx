import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Initial check for mobile
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isMobileDevice)
    }

    // Check immediately
    checkMobile()

    // Add resize listener with debouncing
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 100)
    }

    window.addEventListener('resize', handleResize)
    
    // Also listen for orientation change
    window.addEventListener('orientationchange', checkMobile)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', checkMobile)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isMobile
}
