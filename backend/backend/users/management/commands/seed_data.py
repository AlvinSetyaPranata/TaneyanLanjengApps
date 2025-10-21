from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from users.models import User, Role
from modules.models import Module, Lesson
from activities.models import Activity, UserOverview, TestHistory


class Command(BaseCommand):
    help = 'Seed the database with dummy data'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # Clear existing data (optional)
        self.stdout.write('Clearing existing data...')
        TestHistory.objects.all().delete()
        UserOverview.objects.all().delete()
        Activity.objects.all().delete()
        Lesson.objects.all().delete()
        Module.objects.all().delete()
        User.objects.all().delete()
        Role.objects.all().delete()

        # Create Roles
        self.stdout.write('Creating roles...')
        role_admin = Role.objects.create(name='Admin')
        role_teacher = Role.objects.create(name='Teacher')
        role_student = Role.objects.create(name='Student')
        self.stdout.write(self.style.SUCCESS(f'Created {Role.objects.count()} roles'))

        # Create Users
        self.stdout.write('Creating users...')
        
        # Admin user
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@taneyanlanjeng.edu',
            password='admin123',
            full_name='Administrator',
            institution='Taneyan Lanjeng University',
            semester=0
        )
        admin_user.role = role_admin
        admin_user.save()

        # Teacher users
        teacher1 = User.objects.create_user(
            username='teacher_john',
            email='john.doe@taneyanlanjeng.edu',
            password='teacher123',
            full_name='John Doe',
            institution='Taneyan Lanjeng University',
            semester=0
        )
        teacher1.role = role_teacher
        teacher1.save()

        teacher2 = User.objects.create_user(
            username='teacher_jane',
            email='jane.smith@taneyanlanjeng.edu',
            password='teacher123',
            full_name='Jane Smith',
            institution='Taneyan Lanjeng University',
            semester=0
        )
        teacher2.role = role_teacher
        teacher2.save()

        # Student users
        students = []
        student_data = [
            ('student_alice', 'alice@student.edu', 'Alice Johnson', 'Taneyan Lanjeng University', 3),
            ('student_bob', 'bob@student.edu', 'Bob Wilson', 'Taneyan Lanjeng University', 2),
            ('student_charlie', 'charlie@student.edu', 'Charlie Brown', 'Taneyan Lanjeng University', 4),
            ('student_diana', 'diana@student.edu', 'Diana Prince', 'State University', 5),
            ('student_ethan', 'ethan@student.edu', 'Ethan Hunt', 'State University', 1),
        ]

        for username, email, full_name, institution, semester in student_data:
            student = User.objects.create_user(
                username=username,
                email=email,
                password='student123',
                full_name=full_name,
                institution=institution,
                semester=semester
            )
            student.role = role_student
            student.save()
            students.append(student)

        self.stdout.write(self.style.SUCCESS(f'Created {User.objects.count()} users'))

        # Create Modules
        self.stdout.write('Creating modules...')
        modules_data = [
            ('Introduction to Programming', teacher1, 30),
            ('Data Structures and Algorithms', teacher1, 45),
            ('Web Development Fundamentals', teacher2, 60),
            ('Database Management Systems', teacher2, 40),
            ('Object-Oriented Programming', teacher1, 35),
        ]

        modules = []
        for title, author, days_until_deadline in modules_data:
            module = Module.objects.create(
                title=title,
                deadline=timezone.now() + timedelta(days=days_until_deadline),
                author_id=author
            )
            modules.append(module)

        self.stdout.write(self.style.SUCCESS(f'Created {Module.objects.count()} modules'))

        # Create Lessons for each module
        self.stdout.write('Creating lessons...')
        lessons_data = {
            'Introduction to Programming': [
                'Welcome to Programming! In this lesson, we will cover the basics of programming concepts.',
                'Variables and Data Types: Learn how to store and manipulate data in your programs.',
                'Control Structures: Understanding if-else statements and loops.',
                'Functions: How to organize your code into reusable blocks.',
            ],
            'Data Structures and Algorithms': [
                'Introduction to Arrays and Lists: The fundamental data structures.',
                'Stacks and Queues: LIFO and FIFO data structures explained.',
                'Trees and Graphs: Hierarchical and network data structures.',
                'Sorting and Searching Algorithms: Efficient ways to organize and find data.',
            ],
            'Web Development Fundamentals': [
                'HTML Basics: Structure of web pages.',
                'CSS Styling: Making your web pages beautiful.',
                'JavaScript Introduction: Adding interactivity to websites.',
                'Responsive Design: Creating websites that work on all devices.',
            ],
            'Database Management Systems': [
                'Introduction to Databases: What are databases and why use them?',
                'SQL Basics: Creating and querying databases.',
                'Database Design: Normalization and relationships.',
                'Advanced SQL: Joins, subqueries, and optimization.',
            ],
            'Object-Oriented Programming': [
                'Classes and Objects: The foundation of OOP.',
                'Inheritance and Polymorphism: Code reuse and flexibility.',
                'Encapsulation: Protecting your data.',
                'Design Patterns: Common solutions to recurring problems.',
            ],
        }

        lesson_count = 0
        for module in modules:
            if module.title in lessons_data:
                for content in lessons_data[module.title]:
                    Lesson.objects.create(
                        content=content,
                        module_id=module
                    )
                    lesson_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {lesson_count} lessons'))

        # Create Activities for students
        self.stdout.write('Creating activities...')
        activities = []
        for student in students:
            for i, module in enumerate(modules):
                # Vary progress for different students and modules
                progress = (i + 1) * 20 if i < len(students) else 100
                progress = min(progress, 100)
                
                activity = Activity.objects.create(
                    student_id=student,
                    modules_id=module,
                    progress=progress
                )
                activities.append(activity)

        self.stdout.write(self.style.SUCCESS(f'Created {Activity.objects.count()} activities'))

        # Create UserOverview for each student
        self.stdout.write('Creating user overviews...')
        for i, student in enumerate(students):
            # Get activities for this student
            student_activities = Activity.objects.filter(student_id=student)
            
            # Pick a last module learned (the one with highest progress)
            last_module = student_activities.order_by('-progress').first().modules_id
            
            overview = UserOverview.objects.create(
                user_id=student,
                last_module_learned_id=last_module
            )
            
            # Add activities to the many-to-many relationship
            overview.user_activities.set(student_activities)

        self.stdout.write(self.style.SUCCESS(f'Created {UserOverview.objects.count()} user overviews'))

        # Create TestHistory
        self.stdout.write('Creating test history...')
        test_count = 0
        for student in students[:3]:  # Only first 3 students have test history
            for module in modules[:2]:  # Only for first 2 modules
                TestHistory.objects.create(
                    lesson_id=module
                )
                test_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {test_count} test history records'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Seeding Complete ==='))
        self.stdout.write(f'Roles: {Role.objects.count()}')
        self.stdout.write(f'Users: {User.objects.count()}')
        self.stdout.write(f'Modules: {Module.objects.count()}')
        self.stdout.write(f'Lessons: {Lesson.objects.count()}')
        self.stdout.write(f'Activities: {Activity.objects.count()}')
        self.stdout.write(f'User Overviews: {UserOverview.objects.count()}')
        self.stdout.write(f'Test History: {TestHistory.objects.count()}')
        
        self.stdout.write(self.style.SUCCESS('\n=== Login Credentials ==='))
        self.stdout.write('Admin: username=admin, password=admin123')
        self.stdout.write('Teachers: username=teacher_john/teacher_jane, password=teacher123')
        self.stdout.write('Students: username=student_alice/bob/charlie/diana/ethan, password=student123')
