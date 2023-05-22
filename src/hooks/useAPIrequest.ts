export default function useAPIrequest() {
    async function request(action: string, options: FetchOptionsType) {
        const response = await fetch(action, options);
        const parsedResponse: ServerResponseType = await response.json();
        return parsedResponse.user;
    }

    async function requestWithouContent(
        action: string,
        options: FetchOptionsType,
    ) {
        const response = await fetch(action, options);
        const parsedResponse: ServerResponseType = await response.json();
        return parsedResponse.user;
    }

    return { request, requestWithouContent };
}
