import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';

const Error = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Go back one page in history
  };

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Illustration */}
            <Motion.div variants={itemVariants} className="flex justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-64 h-64 md:w-80 md:h-80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Fridge body */}
                <rect
                  x="40"
                  y="30"
                  width="120"
                  height="140"
                  rx="12"
                  fill="#E2E8F0"
                  stroke="#2C7DA0"
                  strokeWidth="2"
                />
                {/* Door handle */}
                <rect x="140" y="85" width="8" height="30" rx="4" fill="#2C7DA0" />
                {/* Empty shelves (dashed lines) */}
                <line
                  x1="55"
                  y1="70"
                  x2="125"
                  y2="70"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <line
                  x1="55"
                  y1="130"
                  x2="125"
                  y2="130"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                {/* "Broken" crack effect */}
                <path
                  d="M105 45 L110 50 L105 55 L115 60 L105 65"
                  stroke="#F97316"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Sad face */}
                <circle cx="90" cy="160" r="6" fill="#2C7DA0" />
                <circle cx="110" cy="160" r="6" fill="#2C7DA0" />
                <path
                  d="M85 175 Q100 170 115 175"
                  stroke="#2C7DA0"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </Motion.div>

            {/* Right: Text & Actions */}
            <div>
              <Motion.div variants={itemVariants}>
                <p className="text-7xl md:text-8xl font-extrabold text-blue-600 mb-2">
                  404
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                  Oops! This fridge is empty.
                </h1>
                <p className="text-gray-600 mb-6">
                  The page you're looking for has been moved, chilled out, or never existed.
                </p>
              </Motion.div>

              <Motion.div variants={itemVariants}>
                <button
                  onClick={handleGoBack}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  ← Go Back
                </button>
              </Motion.div>
            </div>
          </div>
        </div>
      </Motion.div>
    </div>
  );
};

export default Error;
