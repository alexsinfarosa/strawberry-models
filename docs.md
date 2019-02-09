# Documentation

- fetch data
- data that comes back goes from 00:00 to 23:00
- convert to 01:00 to 24:00
- convert to DST
- clean data
  1. average missing values
  2. replace missing values with sister station
  3. replace missing values with forecast
- have the option to rearrange how the hours are distributed in a day, since some models require a day to go from noon to noon

## ACIS Call

Data is returned from acis is in UTC. It goes from 00:00 to 23:00.

## Cleaning

- Average missing values of current station and flatten all arrays
- Replace remaining missing values with sister station
- If current year, replace remaining missing values with forecast (all days, not only the last 5 days)

# Questions

- When using noon to noon, what is the first day?
