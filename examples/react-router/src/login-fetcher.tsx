import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import type { ActionFunctionArgs } from 'react-router-dom';
import { useFetcher, json, redirect } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
	password: z.string(),
	remember: z.boolean().optional(),
});

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const submission = parse(formData, { schema });

	if (!submission.value) {
		return json(submission.reject());
	}

	return redirect(`/?value=${JSON.stringify(submission.value)}`);
}

export function Component() {
	const fetcher = useFetcher();
	const form = useForm({
		lastResult: fetcher.data,
		onValidate({ formData }) {
			return parse(formData, { schema });
		},
		shouldRevalidate: 'onBlur',
	});

	return (
		<fetcher.Form method="post" {...getFormProps(form)}>
			<div>
				<label>Email</label>
				<input
					className={!form.fields.email.valid ? 'error' : ''}
					{...getInputProps(form.fields.email)}
				/>
				<div>{form.fields.email.errors}</div>
			</div>
			<div>
				<label>Password</label>
				<input
					className={!form.fields.password.valid ? 'error' : ''}
					{...getInputProps(form.fields.password, { type: 'password' })}
				/>
				<div>{form.fields.password.errors}</div>
			</div>
			<label>
				<div>
					<span>Remember me</span>
					<input
						{...getInputProps(form.fields.remember, { type: 'checkbox' })}
					/>
				</div>
			</label>
			<hr />
			<button>Login</button>
		</fetcher.Form>
	);
}
