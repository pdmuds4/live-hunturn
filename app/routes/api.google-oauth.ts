import apiHandler from "~/src/utils/apiHandler";
import { LoaderFunctionArgs, json } from "@remix-run/node";
// import ServerError from "~/src/utils/serverError";

export const loader = (args: LoaderFunctionArgs) => apiHandler(
    args,
    async ({ request }) => {
        return json({ message: request });
    }
)