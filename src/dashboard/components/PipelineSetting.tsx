import React, { FC, useState } from "react";
import { DownloadOutlined, PlusOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { css } from "@emotion/react";
import { Button, Modal, Typography } from "antd";

const settingStyles = css({
	fontSize: 16,
	padding: "5px 0",
	cursor: "pointer",
});

const settingTextStyles = css({
	marginLeft: 10,
});

const { Text } = Typography;
const PipelineSetting: FC = () => {
	const [visible, setVisible] = useState(true);

	function handleToggleVisible() {
		setVisible(!visible);
	}

	return (
		<>
			<span css={settingStyles} onClick={handleToggleVisible}>
				<SettingOutlined />
				<Text css={settingTextStyles}>Pipeline Setting</Text>
			</span>
			<Modal
				width={896}
				title={
					<div
						css={{
							fontSize: 16,
							color: "rgba(0, 0, 0, 0.85)",
							display: "flex",
							alignItems: "center",
						}}>
						<span css={{ flexGrow: 1 }}>Pipeline Setting</span>
						<div
							css={{
								button: {
									margin: "0 4px",
								},
							}}>
							<Button icon={<DownloadOutlined />} disabled={true}>
								Export All
							</Button>
							<Button icon={<UploadOutlined />} disabled={true}>
								Import
							</Button>
							<Button type={"primary"} icon={<PlusOutlined />}>
								Add Pipeline
							</Button>
						</div>
					</div>
				}
				footer={
					<Button size={"large"} css={{ margin: 14 }}>
						Close
					</Button>
				}
				closable={false}
				visible={visible}
				onCancel={handleToggleVisible}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</>
	);
};

export default PipelineSetting;
