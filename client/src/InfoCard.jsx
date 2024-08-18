export default function InfoCard({ data }) {
  if (!data) {
    return (
      <div className="infoCard">
        <h2>No metadata yet</h2>
        <a href="https://www.gotolstoy.com/">Go to Tolstoy to know more!</a>
      </div>
    );
  }

  return (
    <div className="infoCard">
      <h2 className="infoTitle">{data.title}</h2>
      <span className="infoDescription">{data.description}</span>
      <img className="infoImg" src={data.image} alt={data.image} />
      <a className="infoLink" href={data.url}>
        {data.url}
      </a>
    </div>
  );
}
