/**
 * ==========================================================================
 * CITY CARE HOSPITAL — MASTER INTERACTIVE JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+) — Clean, Modular, Student-Friendly
 * 
 * TABLE OF CONTENTS:
 *  1. Theme Switcher (Dark/Light Mode with LocalStorage)
 *  2. Mobile Navigation & Active Page Highlighter
 *  3. Doctors Directory (Live Search & Department Filter)
 *  4. Departments (Live Search & Click-to-Expand Details)
 *  5. Appointment Booking System (Validation, LocalStorage & Dynamic Doctor Fill)
 *  6. "My Appointments" Manager (List & Cancel Bookings)
 *  7. Health Packages (Package Pre-selection & Comparison Toggle)
 *  8. Testimonials Auto-Rotating Carousel with Controls
 *  9. Animated Stats Counters (IntersectionObserver)
 * 10. Facility Gallery Lightbox (Keyboard & Modal Navigation)
 * 11. Accessible FAQ Accordion
 * 12. Contact Form Validation & Feedback
 * 13. Interactive BMI Calculator
 * 14. Floating Back-to-Top Button
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // DOCTORS DATA DICTIONARY (Shared across Booking & Doctors Directory)
  // --------------------------------------------------------------------------
  const hospitalDoctors = [
    { id: 'doc-1', name: 'Dr. Rajesh Sharma', department: 'cardiology', spec: 'Senior Interventional Cardiologist', qual: 'MBBS, MD (Medicine), DM (Cardiology)', exp: '18+ Years', opd: 'Mon - Fri (10:00 AM - 02:00 PM)', image: 'images/doctor-1.jpg' },
    { id: 'doc-2', name: 'Dr. Priya Mehta', department: 'pediatrics', spec: 'Chief Pediatrician & Neonatologist', qual: 'MBBS, MD (Pediatrics), DNB', exp: '14+ Years', opd: 'Mon - Sat (09:00 AM - 01:00 PM)', image: 'images/doctor-2.jpg' },
    { id: 'doc-3', name: 'Dr. Vikramaditya Rathore', department: 'orthopedics', spec: 'Orthopedic & Joint Replacement Surgeon', qual: 'MBBS, MS (Orthopedics), M.Ch (Ortho)', exp: '16+ Years', opd: 'Tue - Sat (11:00 AM - 04:00 PM)', image: 'images/doctor-3.jpg' },
    { id: 'doc-4', name: 'Dr. Ananya Mukherjee', department: 'neurology', spec: 'Senior Neuro-Physician', qual: 'MBBS, MD (Medicine), DM (Neurology)', exp: '12+ Years', opd: 'Mon, Wed, Fri (02:00 PM - 06:00 PM)', image: 'images/doctor-4.jpg' },
    { id: 'doc-5', name: 'Dr. Sunita Choudhary', department: 'gynecology', spec: 'Senior Gynecologist & High-Risk Obstetrician', qual: 'MBBS, MS (Obstetrics & Gynecology), FICOG', exp: '20+ Years', opd: 'Mon - Sat (10:00 AM - 03:00 PM)', image: 'images/doctor-5.jpg' },
    { id: 'doc-6', name: 'Dr. Arvind Verma', department: 'general-medicine', spec: 'Internal Medicine & Critical Care Specialist', qual: 'MBBS, MD (General Medicine)', exp: '15+ Years', opd: 'Daily (09:00 AM - 02:00 PM)', image: 'images/doctor-6.jpg' },
    { id: 'doc-7', name: 'Dr. Neha Kapoor', department: 'dermatology', spec: 'Consultant Dermatologist & Cosmetologist', qual: 'MBBS, DVD, MD (Dermatology)', exp: '10+ Years', opd: 'Mon, Thu, Sat (01:00 PM - 05:00 PM)', image: 'images/doctor-7.jpg' },
    { id: 'doc-8', name: 'Dr. Harish Joshi', department: 'ent', spec: 'ENT & Head-Neck Surgeon', qual: 'MBBS, MS (ENT), DLO', exp: '13+ Years', opd: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)', image: 'images/doctor-8.jpg' }
  ];


  // --------------------------------------------------------------------------
  // FEATURE 1: Dark Mode Toggle with LocalStorage Memory
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('cch_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.setAttribute('aria-checked', 'true');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const targetTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', targetTheme);
      themeToggle.setAttribute('aria-checked', !isDark ? 'true' : 'false');
      localStorage.setItem('cch_theme', targetTheme);
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 2: Mobile Hamburger Menu & Active Nav Highlighter
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when a link inside is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight Current Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  // --------------------------------------------------------------------------
  // FEATURE 3: Doctors Directory (Live Search & Department Filter)
  // --------------------------------------------------------------------------
  const doctorSearch = document.getElementById('doctorSearch');
  const deptFilterButtons = document.querySelectorAll('.doctor-filter-btn');
  const doctorCards = document.querySelectorAll('.doctor-item');
  const noDoctorsFound = document.getElementById('noDoctorsFound');

  function filterDoctors() {
    if (!doctorCards.length) return;
    const query = doctorSearch ? doctorSearch.value.toLowerCase().trim() : '';
    const activeBtn = document.querySelector('.doctor-filter-btn.active');
    const selectedDept = activeBtn ? activeBtn.dataset.filter : 'all';

    let visibleCount = 0;

    doctorCards.forEach(card => {
      const name = card.querySelector('.doctor-name')?.textContent.toLowerCase() || '';
      const spec = card.querySelector('.doctor-spec')?.textContent.toLowerCase() || '';
      const dept = card.dataset.department || '';

      const matchesQuery = name.includes(query) || spec.includes(query);
      const matchesDept = selectedDept === 'all' || dept === selectedDept;

      if (matchesQuery && matchesDept) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noDoctorsFound) {
      noDoctorsFound.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (doctorSearch) {
    doctorSearch.addEventListener('input', filterDoctors);
  }

  if (deptFilterButtons.length) {
    deptFilterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        deptFilterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterDoctors();
      });
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 4: Departments Page (Live Search & Click-to-Expand Details)
  // --------------------------------------------------------------------------
  const deptSearch = document.getElementById('deptSearch');
  const departmentCards = document.querySelectorAll('.department-card');

  if (deptSearch && departmentCards.length) {
    deptSearch.addEventListener('input', () => {
      const q = deptSearch.value.toLowerCase().trim();
      departmentCards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(q) || desc.includes(q)) ? '' : 'none';
      });
    });
  }

  // Expandable details button on department cards
  document.querySelectorAll('.dept-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = btn.closest('.department-card');
      const drawer = parentCard.querySelector('.dept-expandable');
      if (drawer) {
        const isOpened = drawer.classList.contains('active');
        drawer.classList.toggle('active');
        btn.textContent = isOpened ? 'View Clinical Scope & Facilities' : 'Hide Clinical Scope & Facilities';
      }
    });
  });


  // --------------------------------------------------------------------------
  // FEATURE 5: Appointment Booking Form (Dynamic Doctors & Validation)
  // --------------------------------------------------------------------------
  const bookingForm = document.getElementById('appointmentForm');
  const deptSelect = document.getElementById('bookingDept');
  const doctorSelect = document.getElementById('bookingDoctor');
  const dateInput = document.getElementById('bookingDate');
  const confirmationCard = document.getElementById('confirmationCard');

  // Prevent past dates in datepicker
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Dynamic doctor dropdown update based on selected department
  function updateDoctorDropdown(departmentValue, preselectedDoctorId = '') {
    if (!doctorSelect) return;
    doctorSelect.innerHTML = '<option value="">-- Choose Specialist / Doctor --</option>';

    const filtered = departmentValue === '' 
      ? hospitalDoctors 
      : hospitalDoctors.filter(d => d.department === departmentValue);

    filtered.forEach(doc => {
      const opt = document.createElement('option');
      opt.value = doc.name;
      opt.textContent = `${doc.name} (${doc.spec})`;
      if (preselectedDoctorId && (doc.id === preselectedDoctorId || doc.name.toLowerCase().includes(preselectedDoctorId.toLowerCase()))) {
        opt.selected = true;
      }
      doctorSelect.appendChild(opt);
    });
  }

  if (deptSelect && doctorSelect) {
    updateDoctorDropdown(deptSelect.value);
    deptSelect.addEventListener('change', () => {
      updateDoctorDropdown(deptSelect.value);
    });
  }

  // Pre-fill form from URL parameters (e.g. from Doctors or Health Packages page)
  const urlParams = new URLSearchParams(window.location.search);
  const paramDept = urlParams.get('department');
  const paramDoc = urlParams.get('doctor');
  const paramPackage = urlParams.get('package');

  if (deptSelect && paramDept) {
    deptSelect.value = paramDept;
    updateDoctorDropdown(paramDept, paramDoc);
  } else if (doctorSelect && paramDoc) {
    updateDoctorDropdown('', paramDoc);
  }

  if (paramPackage) {
    const reasonField = document.getElementById('bookingReason');
    if (reasonField) {
      reasonField.value = `Health Package Booking: ${paramPackage.replace(/-/g, ' ').toUpperCase()}`;
    }
  }

  // Form Validation & LocalStorage Persistence
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Helper function to validate fields
      function validateField(id, errorId, condition) {
        const input = document.getElementById(id);
        const error = document.getElementById(errorId);
        if (!condition) {
          if (input) input.classList.add('is-invalid');
          if (error) error.classList.add('active');
          isValid = false;
        } else {
          if (input) input.classList.remove('is-invalid');
          if (error) error.classList.remove('active');
        }
      }

      const nameVal = document.getElementById('patientName')?.value.trim() || '';
      const ageVal = parseInt(document.getElementById('patientAge')?.value, 10);
      const phoneVal = document.getElementById('patientPhone')?.value.trim() || '';
      const emailVal = document.getElementById('patientEmail')?.value.trim() || '';
      const deptVal = deptSelect?.value || '';
      const docVal = doctorSelect?.value || '';
      const dateVal = dateInput?.value || '';
      const selectedSlot = document.querySelector('input[name="bookingSlot"]:checked');
      const reasonVal = document.getElementById('bookingReason')?.value.trim() || '';

      validateField('patientName', 'errPatientName', nameVal.length >= 3);
      validateField('patientAge', 'errPatientAge', !isNaN(ageVal) && ageVal > 0 && ageVal < 125);
      validateField('patientPhone', 'errPatientPhone', /^[0-9]{10}$/.test(phoneVal));
      validateField('patientEmail', 'errPatientEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal));
      validateField('bookingDept', 'errBookingDept', deptVal !== '');
      validateField('bookingDoctor', 'errBookingDoctor', docVal !== '');
      validateField('bookingDate', 'errBookingDate', dateVal !== '');

      // Time slot validation
      const slotError = document.getElementById('errBookingSlot');
      if (!selectedSlot) {
        if (slotError) slotError.classList.add('active');
        isValid = false;
      } else {
        if (slotError) slotError.classList.remove('active');
      }

      if (!isValid) return;

      // Generate Reference Code
      const refNumber = 'CCH-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      // Create Booking Object
      const newBooking = {
        ref: refNumber,
        name: nameVal,
        age: ageVal,
        phone: phoneVal,
        email: emailVal,
        department: deptVal,
        doctor: docVal,
        date: dateVal,
        slot: selectedSlot.value,
        reason: reasonVal,
        bookedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      // Save to LocalStorage
      const existing = JSON.parse(localStorage.getItem('cch_appointments') || '[]');
      existing.unshift(newBooking);
      localStorage.setItem('cch_appointments', JSON.stringify(existing));

      // Display Confirmation Box
      if (confirmationCard) {
        confirmationCard.classList.add('active');
        document.getElementById('confRefCode').textContent = refNumber;
        document.getElementById('confDetails').textContent = 
          `Patient: ${nameVal} | Doctor: ${docVal} | Date: ${dateVal} (${selectedSlot.value})`;
        confirmationCard.scrollIntoView({ behavior: 'smooth' });
      }

      bookingForm.reset();
      updateDoctorDropdown('');
      renderMyAppointments();
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 6: "My Appointments" Section (List & Cancel Bookings)
  // --------------------------------------------------------------------------
  function renderMyAppointments() {
    const container = document.getElementById('myAppointmentsList');
    if (!container) return;

    const list = JSON.parse(localStorage.getItem('cch_appointments') || '[]');

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; background: var(--surface-alt); border-radius: var(--radius-md); border: 1px dashed var(--border);">
          <p style="margin: 0; color: var(--text-muted);">No active hospital appointments booked yet. Complete the form above to book a consultation.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = list.map((item, idx) => `
      <div class="booking-item-card">
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
            <strong style="color: var(--primary); font-family: var(--font-headings);">${item.ref}</strong>
            <span class="booking-status confirmed">Confirmed</span>
          </div>
          <h4 style="margin-bottom: 0.25rem;">${item.name} (${item.age} Yrs) — <span style="font-weight: 500; color: var(--text-muted);">${item.doctor}</span></h4>
          <p style="font-size: 0.85rem; margin: 0; color: var(--text-subtle);">
            Date: ${item.date} &nbsp;|&nbsp; Slot: ${item.slot} &nbsp;|&nbsp; Dept: ${item.department.toUpperCase()}
          </p>
        </div>
        <div>
          <button class="btn btn-outline btn-sm cancel-booking-btn" data-index="${idx}" style="color: var(--accent); border-color: var(--accent);">
            Cancel Booking
          </button>
        </div>
      </div>
    `).join('');

    // Attach cancellation handlers
    container.querySelectorAll('.cancel-booking-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const indexToCancel = parseInt(e.target.dataset.index, 10);
        if (confirm(`Are you sure you want to cancel appointment ${list[indexToCancel].ref}?`)) {
          list.splice(indexToCancel, 10);
          localStorage.setItem('cch_appointments', JSON.stringify(list));
          renderMyAppointments();
        }
      });
    });
  }

  renderMyAppointments();


  // --------------------------------------------------------------------------
  // FEATURE 7: Health Packages (Pre-fill Redirect & Comparison Toggle)
  // --------------------------------------------------------------------------
  const packageComparisonToggle = document.getElementById('toggleComparisonBtn');
  const comparisonTable = document.getElementById('packageComparisonSection');

  if (packageComparisonToggle && comparisonTable) {
    packageComparisonToggle.addEventListener('click', () => {
      const isVisible = comparisonTable.style.display !== 'none';
      comparisonTable.style.display = isVisible ? 'none' : 'block';
      packageComparisonToggle.textContent = isVisible 
        ? 'View Full Detailed Test Comparison Table' 
        : 'Hide Detailed Test Comparison Table';
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 8: Testimonials Auto-Rotating Carousel with Controls
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.testimonial-slider .slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  let currentSlideIndex = 0;
  let slideInterval = null;

  if (slides.length > 0) {
    // Generate navigation dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => {
          showSlide(i);
          resetSliderTimer();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function showSlide(index) {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === index);
      });
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.slider-dot').forEach((d, idx) => {
          d.classList.toggle('active', idx === index);
        });
      }
      currentSlideIndex = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlideIndex + 1) % slides.length;
      showSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSliderTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSliderTimer();
      });
    }

    function startSliderTimer() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSliderTimer() {
      clearInterval(slideInterval);
      startSliderTimer();
    }

    startSliderTimer();

    // Pause on hover
    const sliderBox = document.querySelector('.testimonial-slider');
    if (sliderBox) {
      sliderBox.addEventListener('mouseenter', () => clearInterval(slideInterval));
      sliderBox.addEventListener('mouseleave', startSliderTimer);
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 9: Animated Numeric Stats Counters (IntersectionObserver)
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-value[data-target]');
  if (statNumbers.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const increment = Math.ceil(target / 45);

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current.toLocaleString('en-IN') + suffix;
          }, 30);

          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => observer.observe(num));
  }


  // --------------------------------------------------------------------------
  // FEATURE 10: Facility Gallery Lightbox Modal
  // --------------------------------------------------------------------------
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-card');

  let currentGalleryIndex = 0;

  if (lightbox && galleryItems.length) {
    const galleryData = Array.from(galleryItems).map(card => ({
      src: card.querySelector('img').getAttribute('src'),
      alt: card.querySelector('img').getAttribute('alt'),
      title: card.querySelector('.gallery-caption')?.textContent.trim() || ''
    }));

    function openLightbox(index) {
      currentGalleryIndex = index;
      lightboxImg.src = galleryData[index].src;
      lightboxImg.alt = galleryData[index].alt;
      lightboxCaption.textContent = galleryData[index].title;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showNextImage() {
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
      openLightbox(currentGalleryIndex);
    }

    function showPrevImage() {
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
      openLightbox(currentGalleryIndex);
    }

    galleryItems.forEach((item, idx) => {
      item.addEventListener('click', () => openLightbox(idx));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 11: Accessible FAQ Accordion
  // --------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('active');
        questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
      });
    }
  });


  // --------------------------------------------------------------------------
  // FEATURE 12: Contact Form Validation & Success Handling
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      const cName = document.getElementById('contactName');
      const cEmail = document.getElementById('contactEmail');
      const cPhone = document.getElementById('contactPhone');
      const cSubject = document.getElementById('contactSubject');
      const cMessage = document.getElementById('contactMessage');

      function check(input, condition, errorId) {
        const err = document.getElementById(errorId);
        if (!condition) {
          input?.classList.add('is-invalid');
          err?.classList.add('active');
          valid = false;
        } else {
          input?.classList.remove('is-invalid');
          err?.classList.remove('active');
        }
      }

      check(cName, cName?.value.trim().length >= 3, 'errContactName');
      check(cEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cEmail?.value.trim() || ''), 'errContactEmail');
      check(cPhone, /^[0-9]{10}$/.test(cPhone?.value.trim() || ''), 'errContactPhone');
      check(cSubject, cSubject?.value.trim().length >= 3, 'errContactSubject');
      check(cMessage, cMessage?.value.trim().length >= 10, 'errContactMessage');

      if (!valid) return;

      if (contactSuccess) {
        contactSuccess.style.display = 'block';
        contactSuccess.scrollIntoView({ behavior: 'smooth' });
      }

      contactForm.reset();
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 13: Interactive BMI Calculator Widget
  // --------------------------------------------------------------------------
  const bmiForm = document.getElementById('bmiCalculatorForm');
  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('bmiWeight').value);
      const heightCm = parseFloat(document.getElementById('bmiHeight').value);
      const resultBox = document.getElementById('bmiResult');
      const scoreEl = document.getElementById('bmiScore');
      const categoryEl = document.getElementById('bmiCategory');
      const adviceEl = document.getElementById('bmiAdvice');

      if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) return;

      const heightM = heightCm / 100;
      const bmi = (weight / (heightM * heightM)).toFixed(1);

      scoreEl.textContent = bmi;
      resultBox.classList.add('active');

      categoryEl.className = 'bmi-category-badge';

      if (bmi < 18.5) {
        categoryEl.textContent = 'Underweight';
        categoryEl.classList.add('bmi-cat-under');
        adviceEl.textContent = 'You are below standard weight. Consult our clinical nutritionists for personalized weight gain meal plans.';
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        categoryEl.textContent = 'Normal Healthy Weight';
        categoryEl.classList.add('bmi-cat-normal');
        adviceEl.textContent = 'Great work! Maintain this healthy balance with balanced nutrition, daily hydration, and regular exercise.';
      } else if (bmi >= 25 && bmi <= 29.9) {
        categoryEl.textContent = 'Overweight';
        categoryEl.classList.add('bmi-cat-over');
        adviceEl.textContent = 'Your BMI indicates slight excess weight. Incorporate 30 minutes of aerobic exercise and schedule an annual preventive health check.';
      } else {
        categoryEl.textContent = 'Obese Range';
        categoryEl.classList.add('bmi-cat-obese');
        adviceEl.textContent = 'High BMI poses cardiovascular and metabolic risks. We recommend a consultation with our Endocrinology & Metabolic Health specialists.';
      }
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 14: Floating Back-To-Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});

