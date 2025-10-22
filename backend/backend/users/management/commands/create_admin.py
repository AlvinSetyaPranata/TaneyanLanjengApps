from django.core.management.base import BaseCommand
from users.models import User, Role


class Command(BaseCommand):
    help = 'Create an admin user via command line'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Admin username', required=True)
        parser.add_argument('--email', type=str, help='Admin email', required=True)
        parser.add_argument('--password', type=str, help='Admin password', required=True)
        parser.add_argument('--full_name', type=str, help='Admin full name', required=True)
        parser.add_argument('--institution', type=str, help='Institution name', default='Taneyan Lanjeng University')
        parser.add_argument('--profile_photo', type=str, help='Profile photo URL', required=False)

    def handle(self, *args, **kwargs):
        username = kwargs['username']
        email = kwargs['email']
        password = kwargs['password']
        full_name = kwargs['full_name']
        institution = kwargs['institution']
        profile_photo = kwargs.get('profile_photo', '')

        # Check if admin role exists
        try:
            admin_role = Role.objects.get(name='Admin')
        except Role.DoesNotExist:
            self.stdout.write(self.style.ERROR('Admin role does not exist. Please run seed_data command first.'))
            return

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.ERROR(f'User with username "{username}" already exists.'))
            return

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.ERROR(f'User with email "{email}" already exists.'))
            return

        # Create admin user
        admin_user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            full_name=full_name,
            institution=institution,
            semester=0,  # Admins don't have semester
            profile_photo=profile_photo if profile_photo else None
        )
        admin_user.role = admin_role
        admin_user.is_staff = True  # Grant staff access
        admin_user.save()

        self.stdout.write(self.style.SUCCESS(f'Successfully created admin user: {username}'))
        self.stdout.write(f'  Email: {email}')
        self.stdout.write(f'  Full Name: {full_name}')
        self.stdout.write(f'  Institution: {institution}')
        self.stdout.write(self.style.SUCCESS('\nAdmin user can now login with the provided credentials.'))
