import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

const config = __CONFIG__;

/* eslint-disable react/no-danger */

const noindexlist = ['/duyurular', '/kuponlarim/devam-eden'];

export default function Html({
  title,
  description,
  styles,
  scripts,
  app,
  children,
  pathname,
}) {
  return (
    <html className="no-js" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {noindexlist.includes(pathname) && (
          <meta name="robots" content="noindex" />
        )}
        {scripts.map(script => (
          <link key={script} rel="preload" href={script} as="script" />
        ))}
        {styles.map(style => (
          <style
            key={style.id}
            id={style.id}
            dangerouslySetInnerHTML={{ __html: style.cssText }}
          />
        ))}
      </head>
      <body>
        <div
          id="app"
          className="main-wrapper"
          dangerouslySetInnerHTML={{ __html: children }}
        />
        <div id="modal-root" />
        <script
          dangerouslySetInnerHTML={{ __html: `window.App=${serialize(app)}` }}
        />
        {scripts.map(script => (
          <script key={script} src={script} />
        ))}
        {config.GA_CODE && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
                `ga('create','${config.GA_CODE}','auto');ga('send','pageview')`,
            }}
          />
        )}
        {config.GA_CODE && (
          <script
            src="https://www.google-analytics.com/analytics.js"
            async
            defer
          />
        )}
      </body>
    </html>
  );
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  styles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      cssText: PropTypes.string.isRequired,
    }).isRequired
  ),
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  app: PropTypes.object, // eslint-disable-line
  children: PropTypes.string.isRequired,
  pathname: PropTypes.string,
};

Html.defaultProps = {
  styles: [],
  scripts: [],
  pathname: '',
};
