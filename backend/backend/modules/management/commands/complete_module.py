from django.core.management.base import BaseCommand
from users.models import User
from modules.models import Module
from activities.models import Activity


class Command(BaseCommand):
    help = 'Mark a module as completed (100% progress) for testing'

    def add_arguments(self, parser):
        parser.add_argument('--user', type=str, default='admin', help='Username')
        parser.add_argument('--module-id', type=int, help='Module ID to complete')

    def handle(self, *args, **kwargs):
        username = kwargs['user']
        module_id = kwargs.get('module_id')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" not found'))
            return

        if module_id:
            # Complete specific module
            try:
                module = Module.objects.get(id=module_id)
                activity, created = Activity.objects.get_or_create(
                    student_id=user,
                    modules_id=module,
                    defaults={'progress': 100}
                )
                if not created:
                    activity.progress = 100
                    activity.save()
                
                self.stdout.write(self.style.SUCCESS(
                    f'✅ Module "{module.title}" (ID: {module.id}) marked as completed for user "{username}"'
                ))
            except Module.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Module with ID {module_id} not found'))
        else:
            # Complete the first module for demo
            first_module = Module.objects.first()
            if first_module:
                activity, created = Activity.objects.get_or_create(
                    student_id=user,
                    modules_id=first_module,
                    defaults={'progress': 100}
                )
                if not created:
                    activity.progress = 100
                    activity.save()
                
                self.stdout.write(self.style.SUCCESS(
                    f'✅ Module "{first_module.title}" (ID: {first_module.id}) marked as completed for user "{username}"'
                ))
            else:
                self.stdout.write(self.style.ERROR('No modules found in database'))

        # Show all user's module progress
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write('Current Progress for user "{}":'.format(username))
        self.stdout.write('=' * 60)
        
        activities = Activity.objects.filter(student_id=user).select_related('modules_id')
        if activities.exists():
            for activity in activities:
                status = '✅ COMPLETED' if activity.progress >= 100 else f'{activity.progress}% in progress'
                self.stdout.write(f'  {activity.modules_id.title}: {status}')
        else:
            self.stdout.write('  No activities found for this user')
