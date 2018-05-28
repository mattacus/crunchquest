import React from 'react';
import {
  Box, Card, CardHeader, CardHeaderTitle, CardHeaderIcon,
  CardImage, Image, CardContent, Media, MediaContent, MediaLeft, MediaRight,
  Title, Subtitle, Content, Icon, Level, LevelItem,
} from 'bloomer';

const CompanyInfo = props => (
  <div>
    {/* <Box hasTextAlign='centered'>{JSON.stringify(props.item.name)}</Box> */}
    <Card>
      <CardHeader>
        <CardHeaderTitle>
          {`${props.item.name} Info Card`}
        </CardHeaderTitle>
        <CardHeaderIcon>
          <Icon className="fa fa-angle-down" />
        </CardHeaderIcon>
      </CardHeader>
      <CardImage>
        <Box><Level>
          <LevelItem>
            <Image isSize='128x128' src={props.item.profile_image} />
          </LevelItem>
        </Level></Box>
      </CardImage>
      <CardContent>
        <Media>
          <MediaContent>
            <Box>
              <Title isSize={4}>{props.item.name}</Title>
              <Content>
                <p>{props.item.short_description}</p>
                <p>
                  <strong>Homepage:&#8195;</strong>
                  <a href={props.item.homepage_url}>{props.item.homepage_url || '(Not provided)'}</a>
                </p>
                <p>
                  <strong>LinkedIn:&#8195;</strong>
                  <a href={props.item.linkedin_url}>{props.item.linkedin_url || '(Not provided)'}</a>
                </p>
              </Content>
            </Box>
          </MediaContent>
        </Media>
      </CardContent>
    </Card>

  </div>
);

export default CompanyInfo;
