export function getString(formValue: FormDataEntryValue | null): string {
	return typeof formValue === 'string' ? formValue : '';
}
