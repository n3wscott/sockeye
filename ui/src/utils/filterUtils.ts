import { CloudEvent, Filter } from '../types';

export function evaluateFilter(event: CloudEvent, filter: Filter): boolean {
  if (!(filter.attr in event)) {
    return false;
  }

  const eventValue = String(event[filter.attr]);
  
  switch (filter.match) {
    case 'Exact':
      return eventValue === filter.value;
    case 'Includes':
      return eventValue.includes(filter.value);
    case 'Prefix':
      return eventValue.startsWith(filter.value);
    case 'Suffix':
      return eventValue.endsWith(filter.value);
    default:
      return false;
  }
}

export function filterEvents(events: CloudEvent[], filters: Filter[]): CloudEvent[] {
  if (filters.length === 0) {
    return events;
  }

  return events.filter(event => 
    filters.every(filter => evaluateFilter(event, filter))
  );
}