import './About.css'

function About() {
  return (
    <div className="about-tab" id="about">
      <p className="sentence">PathExt's Story</p>
      <p className="about-description">
        PathExt, first coded in 2020 by [INSERT PROPER AUTHORS/CREDITS], is a
        specialized programming tool that sifts through user-uploaded genome sequencing data
        to find the most significant genes and their relations. Through datamining, discovering
        patterns/trends in large form datasets computationally, the program deconstructs the
        uploaded files and highlights which genes or ‘nodes’ are most active under the user’s
        given circumstances. Once found, the connections or ‘pathways’ between each node
        are evaluated to find the shortest distance between those of highest importance,
        mapping those ‘routes’ in turn.
      </p>

      <p className="sentence">Why PathExt.com</p>
      <p className="about-description">
        Traditional gene evaluation techniques require lengthy completion time, are arduous in
        procedure, and monetarily debilitating for the average researcher for whom they are
        designed. Our team’s solution aims to decrease the time commitment through parallel
        processing, provide a straightforward interface to operate, and remove the burden of
        cost from the user entirely. We want to make this technology more widely available for
        the researchers who want to use it, without further hindering their progress with
        complicated. Therefore, PathExt is now available in webpage format, as opposed to its
        original command-line functionality, to accomplish that very thing.
      </p>
    </div>
  )
}

export default About