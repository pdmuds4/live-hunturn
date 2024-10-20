import { ActionFunctionArgs, json, LoaderFunctionArgs, TypedResponse } from "@remix-run/node";
import ServerError from "./serverError";

export default function apiHandler(
    args: LoaderFunctionArgs|ActionFunctionArgs, 
    apiFunc: (args: LoaderFunctionArgs|ActionFunctionArgs)=>Promise<TypedResponse>
) {
    try {
        return apiFunc(args);
    } catch (e) {
        if (e instanceof Error) {
            return json(
                { 
                    message: e instanceof ServerError ? e.message : '予期せぬエラーが発生しました。',
                    detail:  e instanceof ServerError ? e.detail : e.message,
                    route:   args.request.url
                },
                { 
                    status:  e instanceof ServerError ? e.statusCode : 500
                }
            )
        } else {
            return json(
                { 
                    message: '不明なエラーが発生しました。',
                    detail:  e,
                    route:   args.request.url
                },
                { 
                    status: 500
                }
            )
        }
    }
}