#!/usr/bin/env python
"""Check if URLs are properly configured"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.urls import get_resolver

resolver = get_resolver()

print("=" * 60)
print("Checking URL Patterns")
print("=" * 60)

def show_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # This is an include()
            show_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            # This is a URL
            url = prefix + str(pattern.pattern)
            name = pattern.name if hasattr(pattern, 'name') else 'N/A'
            print(f"{url:<50} {name}")

show_urls(resolver.url_patterns)

print("\n" + "=" * 60)
print("Looking for modules/overview endpoint...")
print("=" * 60)

# Check specifically for our endpoint
for pattern in resolver.url_patterns:
    pattern_str = str(pattern.pattern)
    if 'modules' in pattern_str:
        print(f"✓ Found: {pattern_str}")
