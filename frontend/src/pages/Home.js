import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="scale-[1.5] origin-top">
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-100 text-gray-800 font-sans">
        {/* אזור מרכזי: תמונה + כפתורים */}
        <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-10 p-10">
          
          {/* בועות עם הסבר */}
          <div className="flex flex-col gap-6">
            {/* הדרכה */}
            <div className="flex flex-col items-center gap-1">
              <Link to="/guide">
                <button className="bg-green-500 text-white py-3 px-6 rounded-full text-lg shadow-md hover:bg-green-600 transition">
                  הדרכה
                </button>
              </Link>
              <p className="text-sm text-gray-600 text-center max-w-[8rem]">
                למדו שלב אחר שלב עם הדרכה מלאה
              </p>
            </div>

            {/* מבדק */}
            <div className="flex flex-col items-center gap-1">
              <Link to="/practice/quiz">
                <button className="bg-yellow-400 text-white py-3 px-6 rounded-full text-lg shadow-md hover:bg-yellow-500 transition">
                  מבדק
                </button>
              </Link>
              <p className="text-sm text-gray-600 text-center max-w-[8rem]">
                ענו על שאלון וראו את הביצועים שלכם
              </p>
            </div>

            {/* ניסוי */}
            <div className="flex flex-col items-center gap-1">
              <Link to="/practice/test">
                <button className="bg-orange-500 text-white py-3 px-6 rounded-full text-lg shadow-md hover:bg-orange-600 transition">
                  ניסוי
                </button>
              </Link>
              <p className="text-sm text-gray-600 text-center max-w-[8rem]">
                תרחישים פתוחים לבדיקה עצמית מתקדמת
              </p>
            </div>
          </div>

          {/* תמונה */}
          <img
            src="/images/student1.jpeg"
            alt="student"
            className="w-80 rounded-xl shadow-xl"
          />
        </div>

        {/* כותרת ותיאור */}
        <div className="text-center px-4 mt-6">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            לומדה אינטראקטיבית ללמידת תוכנות כופר
          </h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            הכירו את איום הכופרה דרך תיאוריה, סימולציות, תרגול מעשי וכלים נוספים – הכל במקום אחד.
          </p>
        </div>
      </div>
    </div>
  );
}
