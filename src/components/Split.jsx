export default function Split(props) {
    const { active, splitSet } = props;

    return (
        <div>
            <h2>Split?</h2>
            <div className="split-button">
                <button disabled={!active} onClick={() => { splitSet(true) }}>Yes</button>
                <button disabled={!active} onClick={() => { splitSet(false) }}>No</button>
            </div>

        </div>
    );
}