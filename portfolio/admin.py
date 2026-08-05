from django.contrib import admin
from .models import *

admin.site.register([
    Portfolio,
    LifeJourney,
    Certificate,
    SkillCategory,
    Skill,
    Project,
    ProjectDetail,
    Tag,
    TypedText,
    BadgeText,
])