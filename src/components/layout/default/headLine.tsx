type HeadlineProps = {
    title: string,
    subTitle: string
}

export default function Headline({title, subTitle}: HeadlineProps) {
    return (
        <>
            <header className="mb-6 pb-4 -mx-6 px-6 border-b border-border-default">
                <h1>{title}</h1>
                <h4 className="font-medium text-text-secondary">
                    {subTitle}
                </h4>
            </header>
        </>
    )
}