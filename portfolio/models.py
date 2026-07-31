from django.db import models

class Portfolio(models.Model):
    # Golam Rasul Maruf — Backend Developer · Django & Python
    page_title = models.CharField(max_length=256, blank=True, default="")

    create_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.page_title

class LifeJourney(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.DO_NOTHING,
        default=Portfolio.objects.first,
        related_name="journeys"
    )

    order = models.PositiveSmallIntegerField(default=0)
    timeline_date = models.CharField(max_length=256, blank=True, default="")
    timeline_org = models.CharField(max_length=256, blank=True, default="")
    timeline_title = models.CharField(max_length=256, blank=True, default="")
    timeline_desc = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f'{self.timeline_date} - {self.timeline_org} - {self.timeline_title}'
    
    class Meta:
        ordering = ['-order', ]

    # Aug 2024 — Present
    # Bitflux Software
    # Backend Developer Intern (Remote)
    #  Working on the core product's Django backend under two senior engineers.
    #       <ul>
    #         <li>Shipped a referral-tracking module end-to-end (model → API → admin → tests).</li>
    #         <li>Wrote 60+ pytest cases covering the orders domain; caught two regressions before deploy.</li>
    #         <li>Refactored a 400-line view function into a service layer + thin views.</li>
    #       </ul>