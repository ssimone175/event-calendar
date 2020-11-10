# EVENT CALENDAR COMPONENT
## Attribute Options
### Calendar View
The attribute mode can be set to "month", "week" or "day". 
This will change the view of the calendar. If this attribute 
is not set it will default to month view.
In the month view, event names will not be displayed in the
calendar. If the first day of the month is not the first day 
of the week, dates from the old month will be displayed to fill
the whole week. These are grayed out.
In the week view event names will be displayed in the calendar.
Dates from old months are not grayed out.
In the day view events names are displayed in the calendar.
The date takes the full width here instead of 1/7 of the width.
### First day of the week
Different cultures use different first days of the week. You
can set any number from 0-6 as the attribute "first". This
will change which date will appear first in the month and week
view. The number 0 stands for Sunday, 1 for Monday and so on.
If this attribute is not set, Monday is set as the first day
of the week.
### Event Link
For events to be displayed in the calendar, there needs to be
an API that returns an Array of Objects, that have the
properties day*, month*, year*, name*, description and link.
Properties with a * need to exist, the other two are completely
optional. The attribute "eventLink" just needs to be set
to the API Link and the Component will fetch the Array and
work with it.

