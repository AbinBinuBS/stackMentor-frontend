const Footer = () => {
    return (
      <footer className="bg-custom-cyan text-gray-800 py-10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <img src="/images/logo.png" alt="Logo" className="w-32 mb-4 mx-auto md:mx-0" />
              <p className="text-sm">Providing the best mentorship and networking solutions for IT professionals.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8 md:mb-0">
              <div className="flex flex-col items-center md:items-start">
                <h5 className="font-semibold mb-2">Quick Links</h5>
                <a href="/" className="text-gray-600 hover:text-gray-900 mb-1">Home</a>
                <a href="/courses" className="text-gray-600 hover:text-gray-900 mb-1">Courses</a>
                <a href="/mentors" className="text-gray-600 hover:text-gray-900 mb-1">Mentors</a>
                <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
              </div>
              
              <div className="flex flex-col items-center md:items-start">
                <h5 className="font-semibold mb-2">Follow Us</h5>
                <div className="flex space-x-4">
                  <a href="https://facebook.com" className="text-gray-600 hover:text-gray-900">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://linkedin.com" className="text-gray-600 hover:text-gray-900">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="https://instagram.com" className="text-gray-600 hover:text-gray-900">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  