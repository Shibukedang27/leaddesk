import re
from typing import Annotated

from pydantic import StringConstraints

NameString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=80)]
CompanyString = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=2, max_length=120)
]
MessageString = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=10, max_length=1200)
]
PasswordString = Annotated[str, StringConstraints(min_length=8, max_length=128)]
BudgetString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=40)]

BUDGET_PATTERN = re.compile(
    r"^(\$0-\$1k|\$1k-\$5k|\$5k-\$15k|\$15k-\$50k|\$50k\+|"
    r"\$2k - \$5k|\$5k - \$15k|\$15k - \$50k|\$50k\+|Undecided)$"
)


def validate_budget_range(value: str) -> str:
    """Validate budget labels accepted by the public lead form."""

    cleaned = value.strip()
    if not BUDGET_PATTERN.match(cleaned):
        raise ValueError("Budget range is not supported.")
    return cleaned
