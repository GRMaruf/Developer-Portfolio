from django.db import models

class Portfolio(models.Model):
    # Golam Rasul Maruf — Backend Developer · Django & Python
    page_title = models.CharField(max_length=256, blank=True, default="")
    root_url = models.CharField(max_length=256, blank=True, default="")

    # User
    logo_text_mark = models.CharField(max_length=20, default="", blank=True)
    user_short_name = models.CharField(max_length=50, blank=True, default="")
    user_full_name = models.CharField(max_length=200, blank=True, default="")
    job_title = models.CharField(max_length=256, blank=True, default="")
    resume = models.FileField(
        upload_to="",
        blank=True,
        null=True,
        help_text="e.g. expected pdf file with proper nameing as- 'Junior_Web_Developer_GRMaruf.pdf'"
    ) # Handle post delete operations

    # Hero
    image = models.ImageField(
        upload_to="", 
        blank=True, 
        null=True, 
        help_text="e.g. expected 300x300 resolution"
    ) # Handle post delete operations
    status = models.CharField(max_length=256, blank=True, default="")
    title = models.CharField(max_length=256, blank=True, default="")
    description = models.TextField(blank=True, null=True) # provide support for html tags, use "safe" template filter

    # Social Links
    github = models.URLField(null=True, blank=True)
    linked_in = models.URLField(null=True, blank=True)
    leetcode = models.URLField(null=True, blank=True)
    hackerrank = models.URLField(null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    # Footer note
    footnote = models.TextField(blank=True, null=True)

    create_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.page_title
    
class TypedText(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
        default=Portfolio.objects.first,
        related_name="typed_texts"
    )
    text = models.CharField(
        max_length=256, 
        blank=True, 
        default="",
        help_text="e.g. your job roles"
    )

    def __str__(self):
        return self.text
    
class BadgeText(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
        default=Portfolio.objects.first,
        related_name="badge_texts"
    )
    text = models.CharField(max_length=256, blank=True, default="")

    def __str__(self):
        return self.text

class SkillCategory(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
        default=Portfolio.objects.first,
        related_name="skill_category"
    )
    
    order = models.PositiveSmallIntegerField(default=0)
    card_icon_text = models.CharField(max_length=20, default="", blank=True)
    category_name = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return f'{self.card_icon_text} - {self.category_name}'
    
    class Meta:
        verbose_name_plural = 'Skill Categories'
        ordering = ['order']
    
class Skill(models.Model):
    category = models.ForeignKey(
        SkillCategory, 
        on_delete=models.SET_NULL,
        null=True,
        default=SkillCategory.objects.first or SkillCategory.objects.none,
        related_name="skills"
    )

    name = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return f'{self.name}'
    
class Project(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
        default=Portfolio.objects.first,
        related_name="projects"
    )
    screenshot = models.ImageField(
        upload_to="project_shots/", 
        blank=True, null=True, 
        help_text="e.g. expected 300x300 resolution"
    ) # Handle post delete operations
    title = models.CharField(max_length=256, blank=True, default="")
    description = models.TextField(blank=True, null=True)
    github = models.URLField(null=True, blank=True)
    live_link = models.URLField(null=True, blank=True)

    def __str__(self):
        return f'{self.title}'
    
class Tag(models.Model):
    project = models.ForeignKey(
        Project, 
        on_delete=models.SET_NULL,
        null=True,
        default=SkillCategory.objects.first or SkillCategory.objects.none,
        related_name="tags"
    )
    name = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return f'{self.project.title} - {self.name}'
    
    class Meta:
        ordering = ['project__title', ]

class LifeJourney(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
        default=Portfolio.objects.first,
        related_name="journeys"
    )

    order = models.PositiveSmallIntegerField(default=0)
    timeline_date = models.CharField(max_length=256, blank=True, default="")
    timeline_org = models.CharField(max_length=256, blank=True, default="")
    timeline_title = models.CharField(max_length=256, blank=True, default="")
    timeline_desc = models.TextField(blank=True, null=True) # provide support for line breaks, use "linebreaks" template filter
    
    def __str__(self):
        return f'{self.timeline_date} - {self.timeline_org} - {self.timeline_title}'
    
    class Meta:
        ordering = ['-order', ]

class Certificate(models.Model):
    portfolio = models.ForeignKey(
        Portfolio, 
        on_delete=models.SET_NULL,
        null=True,
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

