---
title: "First Steps in Frappe: A Complete Beginner's Journey"
date: 2025-08-11
author: "Victor"
tags: ["Frappe", "Beginner Guide", "Python", "Web Development"]
category: "Tutorial"
excerpt: "Master your first steps in Frappe development. Learn to create apps, understand the framework architecture, set up your development environment, and build your first DocType with this comprehensive guide."
---

# First Steps in Frappe: A Complete Beginner's Journey

Welcome to your Frappe development journey! This comprehensive guide will walk you through everything you need to know to get started with Frappe development, from understanding the basic concepts to building your first application.

## Table of Contents
1. [Understanding the Frappe Ecosystem](#understanding-the-frappe-ecosystem)
2. [Setting Up Your Development Environment](#setting-up-your-development-environment)
3. [Mastering Bench CLI](#mastering-bench-cli)
4. [Creating Your First App](#creating-your-first-app)
5. [Understanding Frappe Architecture](#understanding-frappe-architecture)
6. [Building Your First DocType](#building-your-first-doctype)
7. [Working with the Database](#working-with-the-database)
8. [Creating Custom Scripts](#creating-custom-scripts)
9. [Best Practices for Beginners](#best-practices-for-beginners)
10. [Troubleshooting Common Issues](#troubleshooting-common-issues)

## Understanding the Frappe Ecosystem

Before diving into development, it's crucial to understand what makes Frappe unique:

### What is Frappe?
Frappe is a full-stack web application framework written in Python and JavaScript. It's designed to build database-driven business applications quickly and efficiently.

**Key Characteristics:**
- **Metadata-driven**: Define your app structure through metadata rather than code
- **Multi-tenancy**: One installation can serve multiple organizations
- **Real-time**: Built-in WebSocket support for real-time updates
- **Extensible**: Modular architecture allows easy customization
- **Modern Stack**: Uses MariaDB, Redis, Node.js, and modern JavaScript

### The Frappe Philosophy
Frappe follows the principle of "Convention over Configuration," meaning:
- Standard patterns are built into the framework
- Less boilerplate code required
- Consistent project structure across applications
- Automatic generation of common functionality

## Setting Up Your Development Environment

### Prerequisites Checklist
Before starting, ensure you have:

```bash
# Check Python version (3.8+ required)
python3 --version

# Check Node.js version (14+ required)
node --version

# Check npm version
npm --version

# Check Git
git --version

# Check MariaDB/MySQL
mysql --version
```

### Development Tools Setup

**1. Install Essential Development Tools**
```bash
# Ubuntu/Debian
sudo apt-get install python3-dev python3-setuptools python3-pip
sudo apt-get install redis-server
sudo apt-get install software-properties-common

# macOS (using Homebrew)
brew install python redis node mariadb
```

**2. Install Bench**
```bash
# Install bench globally
pip3 install frappe-bench

# Verify installation
bench --version
```

**3. Set Up Your IDE**
We recommend Visual Studio Code with these extensions:
- Python
- Frappe Framework Snippets
- JavaScript (ES6) code snippets
- Better Jinja
- Auto Rename Tag

## Mastering Bench CLI

Bench is your primary tool for Frappe development. Let's explore its capabilities:

### Essential Bench Commands

**Site Management:**
```bash
# Create a new site
bench new-site mysite.local

# Use a site (sets it as default)
bench use mysite.local

# List all sites
bench list-sites

# Drop a site (be careful!)
bench drop-site mysite.local
```

**App Management:**
```bash
# Create a new app
bench new-app myapp

# Install app to site
bench install-app myapp

# List installed apps
bench list-apps

# Uninstall app from site
bench uninstall-app myapp
```

**Development Commands:**
```bash
# Start development server
bench start

# Update apps and migrate
bench update

# Migrate specific site
bench migrate

# Run Python console
bench console

# Run custom commands
bench execute myapp.utils.my_function
```

**Database Operations:**
```bash
# Backup site
bench backup

# Restore from backup
bench restore path/to/backup.sql

# Import/export data
bench export-csv "DocType Name"
bench import-csv "DocType Name" path/to/file.csv
```

### Bench Configuration

**bench-repo.json** - Repository configuration:
```json
{
    "apps": {
        "frappe": "https://github.com/frappe/frappe.git",
        "myapp": "."
    }
}
```

**common_site_config.json** - Site-wide settings:
```json
{
    "db_host": "localhost",
    "redis_cache": "redis://localhost:13000",
    "redis_queue": "redis://localhost:11000",
    "redis_socketio": "redis://localhost:12000"
}
```

## Creating Your First App

Let's create a complete application step by step:

### Step 1: Initialize the App
```bash
# Create new app
bench new-app library_management

# Follow the prompts:
# App Title: Library Management System
# App Description: A simple library management application
# App Publisher: Your Name
# App Email: your.email@example.com
# App Icon: fa fa-book
# App Color: #3498db
```

### Step 2: App Structure Overview
After creation, your app will have this structure:

```
library_management/
├── library_management/
│   ├── __init__.py
│   ├── hooks.py              # App configuration
│   ├── modules.txt           # List of modules
│   ├── patches.txt           # Database patches
│   └── library_management/   # Main module
│       ├── __init__.py
│       └── doctype/          # DocTypes folder
├── license.txt
├── MANIFEST.in
├── README.md
├── requirements.txt
└── setup.py
```

### Step 3: Understanding hooks.py
The hooks.py file configures your app:

```python
from . import __version__ as app_version

app_name = "library_management"
app_title = "Library Management System"
app_publisher = "Your Name"
app_description = "A simple library management application"
app_icon = "fa fa-book"
app_color = "#3498db"
app_email = "your.email@example.com"
app_license = "MIT"

# Includes in <head>
app_include_css = "/assets/library_management/css/library_management.css"
app_include_js = "/assets/library_management/js/library_management.js"

# Include in <head> for website pages
web_include_css = "/assets/library_management/css/web.css"
web_include_js = "/assets/library_management/js/web.js"

# Home Pages
website_route_rules = [
    {"from_route": "/library", "to_route": "Library"},
]

# Document Events
doc_events = {
    "*": {
        "on_update": "library_management.utils.clear_cache"
    }
}

# Scheduled Tasks
scheduler_events = {
    "daily": [
        "library_management.tasks.send_overdue_notifications"
    ]
}
```

### Step 4: Install the App
```bash
# Install to current site
bench install-app library_management

# Verify installation
bench list-apps
```

## Understanding Frappe Architecture

### The MVC Pattern in Frappe

**Model (DocType)**: Defines data structure
```python
# In doctype JSON or Python controller
class Book(Document):
    def validate(self):
        if not self.isbn:
            frappe.throw("ISBN is mandatory")
```

**View (Templates)**: Renders data
```html
<!-- book.html -->
<div class="book-details">
    <h1>{{ doc.title }}</h1>
    <p>Author: {{ doc.author }}</p>
    <p>ISBN: {{ doc.isbn }}</p>
</div>
```

**Controller (API)**: Handles logic
```python
@frappe.whitelist()
def get_available_books():
    return frappe.get_all("Book", 
        filters={"status": "Available"},
        fields=["name", "title", "author"]
    )
```

### Key Frappe Concepts

**1. DocType**: The foundation of all data structures
- Defines fields, permissions, and behavior
- Automatically creates database tables
- Generates forms and list views

**2. Document**: An instance of a DocType
- Represents a single record
- Has built-in methods for CRUD operations
- Supports hooks for custom logic

**3. Hooks**: Event-driven programming
- on_update, before_save, after_insert
- Validation, permissions, automation
- Custom business logic integration

## Building Your First DocType

Let's create a "Book" DocType for our library system:

### Step 1: Create the DocType
```bash
# Use bench to create DocType
bench make-doctype "Book"

# Or create via web interface:
# Go to: http://your-site:8000/app/doctype
```

### Step 2: Define Fields
In the DocType form, add these fields:

```json
{
    "fields": [
        {
            "fieldname": "title",
            "fieldtype": "Data",
            "label": "Book Title",
            "reqd": 1,
            "in_list_view": 1
        },
        {
            "fieldname": "author",
            "fieldtype": "Data", 
            "label": "Author",
            "reqd": 1,
            "in_list_view": 1
        },
        {
            "fieldname": "isbn",
            "fieldtype": "Data",
            "label": "ISBN",
            "unique": 1,
            "reqd": 1
        },
        {
            "fieldname": "status",
            "fieldtype": "Select",
            "label": "Status",
            "options": "Available\nIssued\nMaintenance",
            "default": "Available",
            "in_list_view": 1
        },
        {
            "fieldname": "publication_year",
            "fieldtype": "Int",
            "label": "Publication Year"
        },
        {
            "fieldname": "price",
            "fieldtype": "Currency",
            "label": "Price"
        }
    ]
}
```

### Step 3: Create Controller Logic
Create `book.py` in the doctype folder:

```python
# library_management/library_management/doctype/book/book.py
import frappe
from frappe.model.document import Document
from frappe.utils import today, getdate
from datetime import datetime

class Book(Document):
    def validate(self):
        """Validation logic"""
        self.validate_isbn()
        self.validate_publication_year()
        self.set_title_case()
    
    def validate_isbn(self):
        """Ensure ISBN is valid format"""
        if self.isbn and len(self.isbn) not in [10, 13]:
            frappe.throw("ISBN must be 10 or 13 digits")
    
    def validate_publication_year(self):
        """Ensure publication year is reasonable"""
        current_year = getdate(today()).year
        if self.publication_year and self.publication_year > current_year:
            frappe.throw("Publication year cannot be in the future")
    
    def set_title_case(self):
        """Convert title to proper case"""
        if self.title:
            self.title = self.title.title()
    
    def before_save(self):
        """Logic before saving"""
        self.set_full_title()
    
    def set_full_title(self):
        """Create a full title with author"""
        if self.title and self.author:
            self.full_title = f"{self.title} by {self.author}"
    
    def on_update(self):
        """Logic after document is updated"""
        self.update_library_stats()
    
    def update_library_stats(self):
        """Update library statistics"""
        # This could update a dashboard or send notifications
        pass

# API Methods
@frappe.whitelist()
def get_book_details(book_name):
    """Get detailed book information"""
    book = frappe.get_doc("Book", book_name)
    return {
        "title": book.title,
        "author": book.author,
        "isbn": book.isbn,
        "status": book.status,
        "price": book.price
    }

@frappe.whitelist()
def search_books(search_term):
    """Search books by title or author"""
    return frappe.db.sql("""
        SELECT name, title, author, status
        FROM `tabBook`
        WHERE title LIKE %(search)s 
        OR author LIKE %(search)s
        ORDER BY title
    """, {
        "search": f"%{search_term}%"
    }, as_dict=True)
```

### Step 4: Create Custom Scripts
Add client-side logic in `book.js`:

```javascript
// library_management/library_management/doctype/book/book.js
frappe.ui.form.on('Book', {
    refresh: function(frm) {
        // Add custom buttons
        if (frm.doc.status === 'Available') {
            frm.add_custom_button(__('Issue Book'), function() {
                issue_book(frm);
            });
        }
        
        if (frm.doc.status === 'Issued') {
            frm.add_custom_button(__('Return Book'), function() {
                return_book(frm);
            });
        }
        
        // Add book search button
        frm.add_custom_button(__('Search Similar'), function() {
            search_similar_books(frm);
        });
    },
    
    isbn: function(frm) {
        // Validate ISBN as user types
        if (frm.doc.isbn && frm.doc.isbn.length > 0) {
            validate_isbn(frm);
        }
    },
    
    title: function(frm) {
        // Auto-generate slug or ID based on title
        if (frm.doc.title) {
            generate_book_code(frm);
        }
    }
});

function issue_book(frm) {
    frappe.prompt({
        label: 'Member ID',
        fieldname: 'member_id',
        fieldtype: 'Link',
        options: 'Library Member',
        reqd: 1
    }, function(values) {
        frappe.call({
            method: 'library_management.api.issue_book',
            args: {
                book: frm.doc.name,
                member: values.member_id
            },
            callback: function(r) {
                if (r.message) {
                    frappe.msgprint('Book issued successfully');
                    frm.reload_doc();
                }
            }
        });
    }, 'Issue Book', 'Issue');
}

function return_book(frm) {
    frappe.confirm(
        'Are you sure you want to return this book?',
        function() {
            frappe.call({
                method: 'library_management.api.return_book',
                args: {
                    book: frm.doc.name
                },
                callback: function(r) {
                    frappe.msgprint('Book returned successfully');
                    frm.reload_doc();
                }
            });
        }
    );
}

function validate_isbn(frm) {
    const isbn = frm.doc.isbn;
    const isbn_pattern = /^(?:\d{10}|\d{13})$/;
    
    if (!isbn_pattern.test(isbn)) {
        frappe.msgprint('Invalid ISBN format. Please enter 10 or 13 digits.');
        frm.set_value('isbn', '');
    }
}

function generate_book_code(frm) {
    const title = frm.doc.title.toLowerCase();
    const code = title.replace(/[^a-z0-9]/g, '-').substring(0, 20);
    frm.set_value('book_code', code);
}

function search_similar_books(frm) {
    if (!frm.doc.author) {
        frappe.msgprint('Please set an author first');
        return;
    }
    
    frappe.call({
        method: 'library_management.library_management.doctype.book.book.search_books',
        args: {
            search_term: frm.doc.author
        },
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                const books = r.message;
                let message = '<h4>Books by ' + frm.doc.author + ':</h4><ul>';
                
                books.forEach(function(book) {
                    if (book.name !== frm.doc.name) {
                        message += '<li><strong>' + book.title + '</strong> - ' + book.status + '</li>';
                    }
                });
                
                message += '</ul>';
                frappe.msgprint(message);
            } else {
                frappe.msgprint('No other books found by this author');
            }
        }
    });
}
```

## Working with the Database

### Understanding Frappe's Database Layer

Frappe provides a powerful abstraction over MariaDB/MySQL:

```python
# Basic queries
frappe.db.get_value("Book", "BOOK-001", "title")
frappe.db.get_list("Book", filters={"status": "Available"})
frappe.db.sql("SELECT * FROM `tabBook` WHERE status = %s", "Available")

# Transactions
frappe.db.begin()
try:
    # Multiple operations
    frappe.db.commit()
except Exception:
    frappe.db.rollback()
```

### Working with Documents

```python
# Create new document
book = frappe.new_doc("Book")
book.title = "The Python Way"
book.author = "John Smith"
book.isbn = "1234567890"
book.insert()

# Get existing document
book = frappe.get_doc("Book", "BOOK-001")

# Update document
book.status = "Issued"
book.save()

# Delete document
book.delete()
```

### Advanced Queries

```python
# Complex filters
books = frappe.get_all("Book", 
    filters=[
        ["status", "=", "Available"],
        ["publication_year", ">", 2020]
    ],
    fields=["name", "title", "author"],
    order_by="title asc",
    limit_start=0,
    limit_page_length=20
)

# Join operations
query = """
    SELECT b.title, b.author, m.member_name
    FROM `tabBook` b
    LEFT JOIN `tabLibrary Transaction` lt ON b.name = lt.book
    LEFT JOIN `tabLibrary Member` m ON lt.member = m.name
    WHERE b.status = 'Issued'
"""
results = frappe.db.sql(query, as_dict=True)
```

## Creating Custom Scripts

### Server Scripts (Python)

Create utility functions in `utils.py`:

```python
# library_management/library_management/utils.py
import frappe
from frappe.utils import today, add_days, getdate

@frappe.whitelist()
def get_overdue_books():
    """Get all overdue books"""
    today_date = getdate(today())
    
    overdue_books = frappe.db.sql("""
        SELECT 
            lt.name,
            lt.book,
            lt.member,
            lt.issue_date,
            lt.return_date,
            b.title,
            m.member_name,
            m.email
        FROM `tabLibrary Transaction` lt
        JOIN `tabBook` b ON lt.book = b.name
        JOIN `tabLibrary Member` m ON lt.member = m.name
        WHERE lt.return_date < %s 
        AND lt.status = 'Issued'
    """, today_date, as_dict=True)
    
    return overdue_books

def send_overdue_notifications():
    """Send email notifications for overdue books"""
    overdue_books = get_overdue_books()
    
    for book in overdue_books:
        send_overdue_email(book)

def send_overdue_email(book_info):
    """Send individual overdue email"""
    if not book_info.get('email'):
        return
    
    subject = f"Overdue Book: {book_info.title}"
    message = f"""
    Dear {book_info.member_name},
    
    This is a reminder that your book "{book_info.title}" 
    was due on {book_info.return_date} and is now overdue.
    
    Please return it as soon as possible.
    
    Thank you,
    Library Management System
    """
    
    frappe.sendmail(
        recipients=[book_info.email],
        subject=subject,
        message=message
    )
```

### Custom API Endpoints

```python
# library_management/library_management/api.py
import frappe
from frappe import _
from frappe.utils import today, add_days

@frappe.whitelist()
def issue_book(book, member, return_date=None):
    """Issue a book to a member"""
    
    # Validate inputs
    if not frappe.db.exists("Book", book):
        frappe.throw(_("Book not found"))
    
    if not frappe.db.exists("Library Member", member):
        frappe.throw(_("Member not found"))
    
    # Check if book is available
    book_doc = frappe.get_doc("Book", book)
    if book_doc.status != "Available":
        frappe.throw(_("Book is not available"))
    
    # Set default return date (14 days from today)
    if not return_date:
        return_date = add_days(today(), 14)
    
    # Create transaction
    transaction = frappe.new_doc("Library Transaction")
    transaction.book = book
    transaction.member = member
    transaction.issue_date = today()
    transaction.return_date = return_date
    transaction.status = "Issued"
    transaction.insert()
    
    # Update book status
    book_doc.status = "Issued"
    book_doc.save()
    
    return {
        "success": True,
        "transaction": transaction.name,
        "message": _("Book issued successfully")
    }

@frappe.whitelist()
def return_book(book):
    """Return a book"""
    
    # Find the active transaction
    transaction = frappe.get_all("Library Transaction",
        filters={
            "book": book,
            "status": "Issued"
        },
        limit=1
    )
    
    if not transaction:
        frappe.throw(_("No active transaction found"))
    
    # Update transaction
    transaction_doc = frappe.get_doc("Library Transaction", transaction[0].name)
    transaction_doc.status = "Returned"
    transaction_doc.actual_return_date = today()
    transaction_doc.save()
    
    # Update book status
    book_doc = frappe.get_doc("Book", book)
    book_doc.status = "Available"
    book_doc.save()
    
    return {
        "success": True,
        "message": _("Book returned successfully")
    }

@frappe.whitelist()
def get_member_history(member):
    """Get borrowing history for a member"""
    
    history = frappe.get_all("Library Transaction",
        filters={"member": member},
        fields=["name", "book", "issue_date", "return_date", 
               "actual_return_date", "status"],
        order_by="issue_date desc"
    )
    
    # Get book details
    for record in history:
        book = frappe.get_doc("Book", record.book)
        record.book_title = book.title
        record.book_author = book.author
    
    return history
```

## Best Practices for Beginners

### 1. Code Organization
```
library_management/
├── library_management/
│   ├── api.py              # API endpoints
│   ├── utils.py            # Utility functions
│   ├── tasks.py            # Background tasks
│   └── library_management/
│       ├── doctype/
│       │   ├── book/
│       │   └── library_member/
│       └── report/         # Custom reports
```

### 2. Naming Conventions
- **DocTypes**: Use Title Case (e.g., "Library Member")
- **Fields**: Use snake_case (e.g., "member_name")
- **Functions**: Use snake_case (e.g., "issue_book")
- **Files**: Use snake_case (e.g., "library_member.py")

### 3. Error Handling
```python
try:
    # Your code here
    result = some_operation()
except frappe.ValidationError as e:
    frappe.log_error(f"Validation error: {str(e)}")
    frappe.throw(_("Invalid data provided"))
except Exception as e:
    frappe.log_error(f"Unexpected error: {str(e)}")
    frappe.throw(_("An unexpected error occurred"))
```

### 4. Performance Tips
```python
# Use get_all() for lists
books = frappe.get_all("Book", 
    fields=["name", "title"],  # Only fetch needed fields
    limit=100  # Limit results
)

# Use db.get_value() for single values
title = frappe.db.get_value("Book", "BOOK-001", "title")

# Batch operations
frappe.db.sql("""
    UPDATE `tabBook` 
    SET status = 'Available' 
    WHERE status = 'Maintenance' AND DATEDIFF(CURDATE(), modified) > 30
""")
```

### 5. Testing Your Code
```python
# test_book.py
import unittest
import frappe

class TestBook(unittest.TestCase):
    def setUp(self):
        # Create test data
        self.book = frappe.get_doc({
            "doctype": "Book",
            "title": "Test Book",
            "author": "Test Author",
            "isbn": "1234567890"
        })
        self.book.insert()
    
    def test_book_creation(self):
        self.assertEqual(self.book.title, "Test Book")
        self.assertEqual(self.book.status, "Available")
    
    def test_isbn_validation(self):
        with self.assertRaises(frappe.ValidationError):
            book = frappe.get_doc({
                "doctype": "Book",
                "title": "Invalid Book",
                "isbn": "123"  # Invalid ISBN
            })
            book.insert()
    
    def tearDown(self):
        # Clean up test data
        self.book.delete()
```

## Troubleshooting Common Issues

### 1. Permission Errors
**Problem**: "You don't have permission to access this resource"

**Solution**:
```python
# Set permissions in hooks.py
permission_query_conditions = {
    "Book": "library_management.permissions.get_book_permissions"
}

# In permissions.py
def get_book_permissions(user):
    if user == "Administrator":
        return ""
    
    return f"(`tabBook`.owner = '{user}' OR `tabBook`.status = 'Available')"
```

### 2. Database Migration Issues
**Problem**: Changes not reflecting in database

**Solution**:
```bash
# Clear cache and migrate
bench clear-cache
bench migrate
bench restart
```

### 3. JavaScript Errors
**Problem**: Custom scripts not working

**Solution**:
```bash
# Check browser console for errors
# Clear assets and rebuild
bench clear-cache
bench build --app library_management
```

### 4. Import Errors
**Problem**: Module not found errors

**Solution**:
```python
# Use relative imports
from . import utils
from .utils import get_overdue_books

# Or absolute imports
from library_management.utils import get_overdue_books
```

## Next Steps

Congratulations! You've learned the fundamentals of Frappe development. Here's what to explore next:

### Intermediate Topics
1. **Custom Fields and Forms**: Advanced form customization
2. **Workflows**: Automated business processes
3. **Reports and Dashboards**: Data visualization
4. **REST API**: Building API endpoints
5. **Email Integration**: Automated notifications

### Advanced Topics
1. **Custom Commands**: CLI extensions
2. **Background Jobs**: Async processing
3. **WebSocket Integration**: Real-time features
4. **Multi-tenancy**: Managing multiple sites
5. **Performance Optimization**: Scaling your application

### Useful Resources
- [Official Frappe Documentation](https://frappeframework.com/docs)
- [Frappe GitHub Repository](https://github.com/frappe/frappe)
- [ERPNext Developer Guide](https://docs.erpnext.com/docs/v13/user/manual/en/develop)
- [Frappe Community Forum](https://discuss.erpnext.com/)

### Practice Projects
1. **Student Management System**: Track students, courses, and grades
2. **Task Management App**: Project management with assignments
3. **Inventory System**: Stock management with suppliers
4. **CRM Application**: Customer relationship management

---

**Ready for the next challenge?** Check out our [ERPNext Installation Guide](04-install-frappe-erpnext-docker.md) to learn how to work with the full ERPNext application built on Frappe.

Remember: Frappe development is about understanding the framework's patterns and leveraging its built-in features. Start simple, experiment often, and gradually build more complex applications as your confidence grows.

Happy coding! 🚀



---