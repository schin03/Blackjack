export default function Layout(props) {
    const {children} = props;

    const header = (
        <header>
            <h1>BlackJack</h1>
        </header>
    );

    const footer = (
        <footer>
            <p>Built by <a href="https://github.com/schin03?tab=repositories" target="_blank"> Sam Chin</a></p>
        </footer>
    ); 

     return (
        <>
            { header }
            { children }
            { footer }
        </>
    )
}