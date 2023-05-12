\c nc_news

      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comment_id) AS INT) AS comment_count
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id
      WHERE topic = cats
      GROUP BY articles.article_id 
      ORDER BY created_at DESC;