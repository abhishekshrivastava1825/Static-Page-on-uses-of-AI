document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     1. SMOOTH SCROLL REVEAL (INTERSECTION OBSERVER)
     ========================================= */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((el, index) => {
    // Subtle stagger for grid cards
    if (el.classList.contains("glass-card")) {
      el.style.transitionDelay = `${(index % 3) * 80}ms`;
    }
    revealObserver.observe(el);
  });

  /* =========================================
     2. GLASS CARD CURSOR SPOTLIGHT EFFECT
     ========================================= */
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* =========================================
     3. SEAMLESS DOMAIN CATEGORY FILTERING
     ========================================= */
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.dataset.filter;

      cards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const shouldShow =
          selectedCategory === "all" || cardCategory === selectedCategory;

        // Smooth fade transition
        card.style.transitionDelay = "0ms";
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";

        setTimeout(() => {
          if (shouldShow) {
            card.classList.remove("hidden-card");
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            });
          } else {
            card.classList.add("hidden-card");
          }
        }, 200);
      });
    });
  });

  /* =========================================
     4. ANIMATED IMPACT METRIC COUNTERS
     ========================================= */
  const metricValues = document.querySelectorAll(".metric-value");
  let countersStarted = false;

  const animateCounters = () => {
    metricValues.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const duration = 1600; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic curve
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const impactSection = document.getElementById("impact");
  if (impactSection) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    counterObserver.observe(impactSection);
  }
});