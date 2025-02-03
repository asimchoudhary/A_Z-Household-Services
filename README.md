🚀 A-Z Household Services | A Comprehensive Home Service Booking Platform

A-Z Household Services is a full-stack web application designed to streamline household service bookings. The platform connects users (customers) with service providers while being managed by an administrator who ensures security and service quality.

🔹 Key Features:
✅ Role-Based Access Control: Users, service providers, and administrators have distinct roles, secured using Flask-Security.
✅ Seamless Booking System: Users can request services, visible to all relevant providers, with one accepting the request.
✅ Service Tracking & Reviews: Users and providers track completed services via their dashboards, and users can leave reviews.
✅ Automated Notifications & Reports:

Daily Reminders for service providers with open requests.
Monthly Service Reports for customers detailing accepted/declined services.
✅ Optimized Performance: Flask-Caching enhances efficiency, while Celery & Redis handle background tasks.
✅ Secure Email System: Notifications powered by MailHog’s SMTP server.
✅ Modern Frontend: Built with Vue 3 and Vue Router for a smooth user experience.
🔹 Tech Stack:
Backend: Flask, Flask-Security, SQLite3, Celery, Redis, MailHog
Frontend: Vue 3, Vue Router
