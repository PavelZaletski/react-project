import React from 'react';

export class Image extends React.Component {
    componentDidMount() {

    }

    componentWillMount() {

    }

    render() {
        const article = this.props.article;
        const { imageWidth, imageHeight } = article;
        const styles = {};
        if (imageWidth && imageHeight) {
            styles.width = imageWidth + 'px';
            styles.height = imageHeight + 'px';
        }

        return (
            <div className="imageWrapper" style={styles}>
                <img className="preview" src={article.preview} />
                <img className="articleImage" src={'/image/' + article.urlToImage} />
            </div>
        );
    }
}
