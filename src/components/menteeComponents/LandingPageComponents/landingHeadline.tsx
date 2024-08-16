const LandingHeadline = () => {
    return (
      <div className="relative my-16 flex flex-col-reverse md:flex-row items-center justify-between w-full h-[400px] p-5 border-b-2 border-blue-100">
        <div className="flex flex-col items-start max-w-md mx-36 md:max-w-lg mb-10 md:mb-0">
          <h1 className="text-2xl sm:text-3xl  md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6  md:mx-8 whitespace-nowrap">
            LEARN NEW THINGS
          </h1>
          <button className="px-4 py-2 md:px-6 mx-10 md:py-3 rounded-xl bg-custom-cyan border  text-gray-800 text-base md:text-lg font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
            Get Started
          </button>
        </div>
            <img src="images/bannerimg1.png" className="absolute right-4  w-32 md:w-48 lg:w-96" alt="Banner Image" />
      </div>
    );
  };
  
  export default LandingHeadline;
  