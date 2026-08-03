from django.db import models

class Portfolio(models.Model):
    # Golam Rasul Maruf — Backend Developer · Django & Python
    page_title = models.CharField(max_length=256, blank=True, default="")
    rout_url = models.CharField(max_length=256, blank=True, default="")

    # User
    logo_text_mark = models.CharField(max_length=20, default="", blank=True)
    user_short_name = models.CharField(max_length=50, blank=True, default="")
    user_full_name = models.CharField(max_length=200, blank=True, default="")
    

    # Social Links
    github = models.URLField(null=True, blank=True)
    linked_in = models.URLField(null=True, blank=True)
    leetcode = models.URLField(null=True, blank=True)

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

class Certificate(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.DO_NOTHING,
        default=Portfolio.objects.first,
        related_name="certificates"
    )

    order = models.PositiveSmallIntegerField(default=0)
    logo_text_mark = models.CharField(max_length=20, default="", blank=True)
    title = models.CharField(max_length=256, blank=True, default="")
    organization = models.CharField(max_length=256, blank=True, default="")
    issue_date = models.CharField(max_length=50, blank=True, default="") # May 2023
    verify_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'{self.title} - {self.organization}'
    
    class Meta:
        ordering = ['-order', ]

