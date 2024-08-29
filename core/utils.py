"""
Defines global variables used
"""

MALE = 1
FEMALE = 0
OTHER = 2

gender_choices = ((MALE, "MALE"), (FEMALE, "FEMALE"), (OTHER, "OTHER"))

DELETED = 0
ACTIVE = 1
INACTIVE = 2

existence_status = ((DELETED, "DELETED"), (ACTIVE, "ACTIVE"), (INACTIVE, "INACTIVE"))

CASH = 0
CREDIT = 1
UPI = 2
CARD = 3

payment_mode = ((CASH, "CASH"), (CREDIT, "CREDIT"), (UPI, "UPI"), (CARD, "CARD"))
