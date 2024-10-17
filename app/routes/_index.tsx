import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "Live Hunturn" },
        { 
            name: "description", 
            content: `モンスターハンター参加配信者用サービス。参加希望者の管理を表示できるインターフェイスを用意しています` 
        },
    ];
};

export default function Index() {
    return (
        <>
            あいうおtaaaa
        </>
    );
}
