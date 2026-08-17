import { useEffect } from "react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#2457D6] flex items-center justify-center overflow-hidden">
      
      <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-[#B8E34B]/10" />

      <div className="relative flex flex-col items-center text-center px-6">

        {/* NEW LOGO */}
        <div className="splash-logo">
          <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white border-2 border-[#14213D] shadow-[7px_7px_0_#14213D] flex items-center justify-center overflow-hidden">
            <img
              src="/prepgenius_logo_new.jpg"
              alt="PrepGenius"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* BRAND NAME */}
        <div className="splash-brand mt-7">
          <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.055em] text-white">
            Prep<span className="text-[#B8E34B]">Genius</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base font-bold tracking-[0.18em] uppercase text-white/70">
            Prepare <span className="text-[#B8E34B]">•</span> Learn{" "}
            <span className="text-[#B8E34B]">•</span> Grow
          </p>
        </div>

        {/* LOADING LINE */}
        <div className="splash-loader mt-9 w-28 h-1 bg-white/15 overflow-hidden">
          <div className="h-full w-1/2 bg-[#B8E34B]" />
        </div>
      </div>

      <style>{`
        .splash-logo {
          animation: splashLogo 900ms cubic-bezier(.2,.8,.2,1) both;
        }

        .splash-brand {
          animation: splashBrand 700ms ease-out 350ms both;
        }

        .splash-loader {
          animation: splashFade 500ms ease-out 650ms both;
        }

        .splash-loader > div {
          animation: splashLoad 1300ms ease-in-out both;
        }

        @keyframes splashLogo {
          0% {
            opacity: 0;
            transform: scale(.72) rotate(-4deg);
          }

          70% {
            opacity: 1;
            transform: scale(1.04) rotate(0deg);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes splashBrand {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes splashLoad {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(230%);
          }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
