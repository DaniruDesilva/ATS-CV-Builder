'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  safeRedirect?: string;
  onError?: (msg: string) => void;
}

export function GoogleAuthButton({
  mode = 'signin',
  safeRedirect = '/dashboard',
  onError,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { signInWithGoogle, signInWithGoogleIdToken } = useAuthStore();
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize Google Identity Services
  const setupGis = () => {
    if (typeof window === 'undefined' || !(window as any).google?.accounts?.id || !googleClientId) {
      return;
    }

    try {
      (window as any).google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          if (!response?.credential) {
            onError?.('Google authentication returned no credentials.');
            return;
          }

          setLoading(true);
          const res = await signInWithGoogleIdToken(response.credential);
          if (res.error) {
            onError?.(res.error);
            setLoading(false);
          } else {
            if (typeof window !== 'undefined') {
              window.location.href = safeRedirect;
            } else {
              router.push(safeRedirect);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google button into container if ref is ready
      if (googleBtnContainerRef.current) {
        (window as any).google.accounts.id.renderButton(
          googleBtnContainerRef.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 380,
          }
        );
      }

      setGisLoaded(true);
    } catch (err) {
      console.error('Failed to initialize Google Identity Services:', err);
    }
  };

  useEffect(() => {
    if ((window as any).google?.accounts?.id) {
      setupGis();
    }
  }, [googleClientId, mode]);

  // Fallback click handler if user clicks our custom styled button
  const handleCustomButtonClick = async () => {
    setLoading(true);

    if (gisLoaded && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to standard Supabase OAuth if prompt popup was blocked
            signInWithGoogle(safeRedirect).then((res) => {
              if (res.error) {
                onError?.(res.error);
                setLoading(false);
              }
            });
          }
        });
        return;
      } catch {
        // Fall back to standard OAuth
      }
    }

    // Direct OAuth fallback
    const res = await signInWithGoogle(safeRedirect);
    if (res.error) {
      onError?.(res.error);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={setupGis}
      />

      <div className="w-full flex flex-col items-center">
        {/* Hidden or visible GIS rendered container */}
        <div
          ref={googleBtnContainerRef}
          className={`w-full flex justify-center ${gisLoaded ? 'block' : 'hidden'}`}
          style={{ minHeight: '40px' }}
        />

        {/* Fallback button when GIS is not rendered yet or loading */}
        {!gisLoaded && (
          <button
            type="button"
            onClick={handleCustomButtonClick}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {loading
                ? 'Connecting to Google...'
                : mode === 'signup'
                ? 'Continue with Google'
                : 'Sign in with Google'}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
