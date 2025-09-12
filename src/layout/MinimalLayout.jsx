function MinimalLayout({ children }) {
  return (
    <div className="container-fluid">
      <main className="row">
        <div className="col-12">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MinimalLayout;
