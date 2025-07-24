// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const logo = document.getElementById("logo");
  const preloader = document.getElementById("preloader");
  const mainContent = document.getElementById("main-content");

  // Animate logo in
  gsap.to(logo, {
    duration: 1.5,
    y: -50,
    opacity: 1,
    ease: "power2.out",
  });

  // After delay, fade out preloader and show content
  setTimeout(() => {
    gsap.to(preloader, {
      duration: 1.5,
      opacity: 0,
      onComplete: () => {
        preloader.style.display = "none";
        gsap.to(mainContent, {
          duration: 1,
          opacity: 1,
          ease: "power2.out",
        });
      },
    });
  }, 2500); // Logo stays for 2.5 seconds
});
