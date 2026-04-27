import './About.css'

function About() {
  return (
    <div className="about-tab" id="about">
      <p className="sentence">PathExt's Story</p>
      <p className="about-description">
        PathExt, first introduced in 2020 by Narmada Sambaturu and published in <em>Bioinformatics (Oxford Academic)</em>, 
        is a specialized computational framework that analyzes genome-scale biological data to identify the most significant 
        genes and their relationships within a network. Through advanced data mining techniques, the program processes 
        large-scale omics datasets and highlights which genes, or “nodes,” are most active under a given condition. Rather 
        than focusing only on individual genes, PathExt evaluates the connections, or “pathways,” between them—identifying the 
        most important routes within the network and mapping biologically meaningful interactions.
      </p>

      <p className="sentence">Why PathExt.com</p>
      <p className="about-description">
        Traditional gene evaluation techniques can be time-intensive, complex, and often inaccessible to many researchers 
        due to technical or financial barriers. Our goal is to make this powerful methodology more efficient and widely usable. 
        PathExt.com brings this framework to a web-based platform, reducing the need for command-line tools and simplifying the 
        user experience. By streamlining the workflow and improving accessibility, we aim to empower researchers to explore 
        complex biological systems more easily, without unnecessary overhead or cost.
      </p>
    </div>
  )
}

export default About