from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib import messages  # Added to show success messages
from django.utils.text import slugify
from .models import *
from django.core.mail import send_mail
from django.template.loader import render_to_string

def index(request):
    portfolio = Portfolio.objects.prefetch_related("projects__details").first()
    # project_data = {slugify(project.title): project for project in portfolio.projects.all()}
    project_data = {}
    for project in portfolio.projects.all():
        project_data[slugify(project.title)] = { 
            "title": project.title,
            "sub": project.details.subtitle,
            "img": project.screenshot.url if project.screenshot else "",
            "overview": project.details.overview,
            "features": [feature.strip() for feature in project.details.features.split('\n')],
            "tags": [tag.strip() for tag in project.details.tags.split(',')],
            "learned": project.details.learned,
            "github": project.github,
            "demo": project.live_link,
        }
    # for project in project_data.values():
    #     project = { 
    #         "title": project.title,
    #         "sub": project.details.subtitle,
    #         "img": project.screenshot.url if project.screenshot else "",
    #         "overview": project.details.overview,
    #         "features": [feature.strip() for feature in project.details.features.split('\n')],
    #         "tags": [tag.strip() for tag in project.details.tags.split(',')],
    #         "learned": project.details.learned,
    #         "github": project.github,
    #         "demo": project.live_link,
    #     }
    print(project_data)
    # project_data = list(portfolio.projects.values(
    #     "title",
    #     "details__subtitle",
    #     "screenshot",
    #     "details__overview",
    #     "details__features",
    #     "details__tags",
    #     "details__learned",
    #     "github",
    #     "live_link",
    # ))
    # project_data = {slugify(project["title"]): project for project in project_data}
    # print(project_data)

    if request.method == "POST":
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        subject = request.POST.get('subject', '').strip()
        message = request.POST.get('message', '').strip()

        # Backend protection check: verify email isn't blank
        if email and portfolio:
            notification_mail = render_to_string(
                'notification_mail.html',
                {
                    'portfolio': portfolio.user_full_name, 
                    'sender_name': name, 
                    'sender_email': email, 
                    'message_subject': subject, 
                    'message_body': message
                }
            )
            confirmation_mail = render_to_string(
                'confirmation_mail.html',
                {
                    'portfolio': portfolio.user_full_name, 
                    'sender_name': name, 'message_subject': 
                    subject, 'message_preview': message[:50], 
                    'github_link': portfolio.github
                }
            )

            # Mail 1: To You
            result1 = send_mail(
                subject="Notification From Your Portfolio",
                message=message,
                from_email=None,  
                recipient_list=[portfolio.email],
                fail_silently=False,
                html_message=notification_mail
            )

            # Mail 2: To Sender (Confirmation)
            result2 = send_mail(
                subject="Confirmation of Your Contact",
                message="Thank you for reaching out!",
                from_email=None,  
                recipient_list=[email],
                fail_silently=False,
                html_message=confirmation_mail
            )
            
            print("The results are: ", result1, result2)
            
            if result1 and result2:
                # Add a temporary message that survives a redirect
                messages.success(request, "Thanks — message received. I'll get back to you within a day.")
                return redirect(reverse('index') + "#form-message")  # 3. Redirect back to your URL name (resets scroll)

    # Continue rendering the page
    return render(request, 'index.html', {
        "portfolio": portfolio,
        "project_data": project_data
    })
