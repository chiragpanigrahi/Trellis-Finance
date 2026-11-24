import { format, formatDistanceToNow, parseISO } from 'date-fns';

const parse = d => typeof d === 'string' ? parseISO(d) : new Date(d);

export const formatDate     = (d, pat='MMM d, yyyy')   => d ? format(parse(d), pat) : '--';
export const formatDateTime = d                         => d ? format(parse(d), 'MMM d, yyyy HH:mm') : '--';
export const formatRelative = d                         => d ? formatDistanceToNow(parse(d), {addSuffix:true}) : '--';
export const formatISODate  = d                         => d ? format(parse(d), 'yyyy-MM-dd') : '';
