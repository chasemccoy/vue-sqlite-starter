import type { RecordType } from '@shared/types';

export function getIconForRecordType(type: RecordType) {
	switch (type) {
		case 'artifact':
			return 'i-lucide-box';
		case 'concept':
			return 'i-lucide-brain';
		case 'entity':
			return 'i-lucide-users';
	}
}
