import { LoaderFunctionArgs, TypedResponse, json } from "@remix-run/node";
import apiHandler from "~/src/utils/apiHandler";
import ServerError from "~/src/utils/serverError";

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        const param = new URL(request.url).searchParams;
        const liveID = param.get('live_id');
    }
);