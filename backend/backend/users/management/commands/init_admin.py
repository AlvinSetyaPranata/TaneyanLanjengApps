from django.core.management.base import BaseCommand
from users.models import User, Role


class Command(BaseCommand):
    help = 'Initialize admin roles and create default admin user'

    def handle(self, *args, **kwargs):
        self.stdout.write('Initializing admin roles and users...')

        # Create Roles if they don't exist
        self.stdout.write('Creating roles...')
        
        # Create Admin role
        try:
            admin_role = Role.objects.get(name='Admin')
            self.stdout.write('Admin role already exists')
        except Role.DoesNotExist:
            admin_role = Role.objects.create(name='Admin')
            self.stdout.write('Created Admin role')
            
        # Create Teacher role
        try:
            teacher_role = Role.objects.get(name='Teacher')
            self.stdout.write('Teacher role already exists')
        except Role.DoesNotExist:
            teacher_role = Role.objects.create(name='Teacher')
            self.stdout.write('Created Teacher role')
            
        # Create Student role
        try:
            student_role = Role.objects.get(name='Student')
            self.stdout.write('Student role already exists')
        except Role.DoesNotExist:
            student_role = Role.objects.create(name='Student')
            self.stdout.write('Created Student role')

        # Create default admin user if it doesn't exist
        try:
            admin_user = User.objects.get(username='admin')
            self.stdout.write('Default admin user already exists')
        except User.DoesNotExist:
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@taneyanlanjeng.edu',
                password='admin123',
                full_name='Administrator',
                institution='Taneyan Lanjeng University',
                semester=0,
                profile_photo='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                is_active=True,
                is_staff=True
            )
            admin_user.role = admin_role
            admin_user.save()
            
            self.stdout.write('Created default admin user: admin')
            self.stdout.write('  Email: admin@taneyanlanjeng.edu')
            self.stdout.write('  Password: admin123')

        self.stdout.write('\n=== Admin Initialization Complete ===')
        self.stdout.write('Roles and admin user are ready for use.')