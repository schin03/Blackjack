export default function Insurance(props) {
    const {active, insuranceSet} = props;



    return(
        <div>
            <h2>Insurance?</h2>
            <button disabled={!active} onClick={() => {insuranceSet(true)}}>Yes</button>
            <button disabled={!active} onClick={() => {insuranceSet(false)}}>No</button>        
        </div>
    );

}